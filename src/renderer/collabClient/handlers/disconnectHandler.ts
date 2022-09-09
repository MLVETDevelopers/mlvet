import { collabSessionEnded } from 'renderer/store/collab/actions';
import { pageChanged } from 'renderer/store/currentPage/actions';
import { ApplicationPage } from 'renderer/store/currentPage/helpers';
import { currentProjectClosed } from 'renderer/store/currentProject/actions';
import store from 'renderer/store/store';
import { ServerMessageHandler } from '../types';

const disconnectHandler: ServerMessageHandler = () => () => {
  const { dispatch } = store;
  const { collab } = store.getState();

  if (collab !== null && collab.sessionCode !== null) {
    dispatch(collabSessionEnded());

    if (!collab.isHost) {
      dispatch(currentProjectClosed());
      dispatch(pageChanged(ApplicationPage.HOME));
    }
  }
};

export default disconnectHandler;
