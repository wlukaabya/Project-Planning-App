export const UserReducer = (state, action) => {
  switch (action.type) {
    case "LOAD_DATA":
      return { ...state, loading: action.data };

    case "LOAD_PROJECTS":
      return { ...state, projects: [...state.projects, ...action.data] };

    case "DELETE_PROJECT":
      return {
        ...state,
        projects: state.projects.filter((item) => item.id !== action.id),
      };
    case "USERS_LIST":
      return { ...state, users: [...state.users, ...action.data] };

    case "SET_USER":
      return {
        ...state,
        user: {
          id: action.payload.id,
          name: action.payload.name,
          roles: action.payload.roles,
        },
      };
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.data] };

    case "LOAD_TASKS":
      return { ...state, tasks: [...action.data] };

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.id),
      };

    case "EDIT_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id === action.data.id) {
            return action.data;
          }
          return task;
        }),
      };

    case "ADD_PROJECT":
      return { ...state, projects: [...state.projects, action.data] };

    case "EDIT_PROJECT":
      const { data } = action.payload;

      return {
        ...state,
        projects: state.projects.map((project) => {
          if (project.id === data.id) {
            return data;
          }

          return project;
        }),
      };
    default:
      return state;
  }
};
