import {
  Dispatch,
  ReactElement,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDebounce } from '@react-hook/debounce';
import { useWindowResizer } from 'renderer/utils/hooks';
import { clamp } from 'main/timeUtils';
import { getAspectRatio, getElementSize } from 'renderer/util';

// Used for calculating the max size of the video preview
const pageLayoutPadding = { x: 96 * 2 + 2, y: 64 };

const pageLayoutOptions = {
  minTranscriptionWidth: 120,
  minVideoPreviewWidth: 120,
};

const defaultAspectRatio = 16 / 9;

interface VideoResizeOptions {
  minTargetWidth: number;
  maxTargetWidth: number;
}

type ChildFunction = (
  videoPreviewContainerWidth: number,
  setVideoPreviewContainerWidth: Dispatch<SetStateAction<number>>,
  videoResizeOptions: VideoResizeOptions
) => ReactElement;

interface Props {
  projectPageLayoutRef: RefObject<HTMLDivElement>;
  videoPreviewContainerRef: RefObject<HTMLDivElement>;
  children: ChildFunction;
}

const ResizeManager = ({
  projectPageLayoutRef,
  videoPreviewContainerRef,
  children,
}: Props) => {
  const [videoPreviewContainerWidth, setVideoPreviewContainerWidth] =
    useDebounce(400, 0.1);

  const videoAspectRatioRef = useRef({
    ratio: defaultAspectRatio,
    isSaved: false,
  });

  const [videoResizeOptions, setVideoResizeOptions] =
    useState<VideoResizeOptions>({
      minTargetWidth: 120,
      maxTargetWidth: 120,
    });

  const getVideoAspectRatio = useMemo(
    () => () => {
      const videoAspectRatio = videoAspectRatioRef.current.isSaved
        ? videoAspectRatioRef.current.ratio
        : getAspectRatio(
            videoPreviewContainerRef.current as HTMLDivElement,
            defaultAspectRatio
          );

      if (!videoAspectRatioRef.current.isSaved) {
        videoAspectRatioRef.current = {
          ratio: videoAspectRatio,
          isSaved: true,
        };
      }

      return videoAspectRatio;
    },
    [videoAspectRatioRef, videoPreviewContainerRef]
  );

  const windowResizeHandler = useCallback(
    (newPageSize) => {
      // A manual way of calculating the min and max width of the video preview container.
      // Will need to be updated if styling changes are made to avoid bugs

      const pageSize =
        getElementSize(projectPageLayoutRef?.current as HTMLDivElement) ??
        newPageSize;

      const videoAspectRatio = getVideoAspectRatio();

      // Use padding and transcription size to calculate max width based on available width
      const maxWidthBasedOnWidth =
        pageSize.width -
        pageLayoutPadding.x -
        pageLayoutOptions.minTranscriptionWidth;

      // Use aspect-ratio to calculate the max width based on available height
      const maxWidthBasedOnHeight =
        videoAspectRatio * (pageSize.height - pageLayoutPadding.y);

      const maxTargetWidth = Math.min(
        maxWidthBasedOnWidth,
        maxWidthBasedOnHeight
      );

      const minTargetWidth = Math.min(
        pageLayoutOptions.minVideoPreviewWidth,
        maxTargetWidth
      );

      setVideoResizeOptions({
        minTargetWidth,
        maxTargetWidth,
      });
    },
    [getVideoAspectRatio, projectPageLayoutRef]
  );

  useWindowResizer(windowResizeHandler);

  useEffect(() => {
    setVideoPreviewContainerWidth(
      clamp(
        videoResizeOptions.minTargetWidth,
        videoPreviewContainerWidth,
        videoResizeOptions.maxTargetWidth
      )
    );
    // Don't want to run this every time user resizes video preview, only on window resize
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setVideoPreviewContainerWidth, videoResizeOptions]);

  return children(
    videoPreviewContainerWidth,
    setVideoPreviewContainerWidth,
    videoResizeOptions
  );
};

export default ResizeManager;
