import actions from '../strings/actions.json';

export default (state = {}, action) => {
  switch (action.type) {
    case actions.map.fetchUpdate.pending:
    case actions.map.fetch.pending:
      return {
        ...state,
        nodes: [],
        connections: [],
        loading: true,
        fetched: false,
        error: undefined,
      };

    case actions.map.fetchUpdate.fulfilled: {
      // Update URL on the browser
      const url = action.payload.config.url.replace('maps/', '');
      window.history.pushState(null, null, url);
    }
    // Fall through next case.

    case actions.map.fetch.fulfilled: {
      // Update map data.
      const connections = action.payload.data.connections;
      const subnodes = action.payload.data.subnodes;
      const nodes = action.payload.data.nodes;

      // Set HTML title.
      const url = action.payload.config.url.replace('maps/', '');
      const urlSplit = url.split('/');
      const topic = urlSplit[urlSplit.length - 1];
      document.title = topic.replace('-', ' ').concat(' - Learn Anything');

      return {
        ...state,
        url,
        nodes,
        subnodes,
        connections,
        loading: false,
        fetched: true,
        exploring: true,
        error: undefined,
      };
    }

    case actions.map.fetchUpdate.rejected:
    case actions.map.fetch.rejected: {
      // Error fetching map.
      const error = action.payload;

      return {
        ...state,
        error,
        nodes: [],
        connections: [],
        loading: false,
        fetched: false,
      };
    }

    default:
      return state;
  }
};
