const migrateProject = (key) => {
  try {
    const json = localStorage.getItem(key);
    const project = JSON.parse(json);
    localStorage.removeItem(key);
    return project;
  } catch (error) {
    throw new Error(`Migration failed: ${error}`);
  }
};

export default () => {
  const json = localStorage.getItem('fiddles');
  if (!json) return {};
  try {
    const keys = JSON.parse(json);
    const projects = keys
        .map(migrateProject)
        .filter(project => project)
        .reduce((obj, project) => {
          obj[project.key] = project;
          return obj;
        }, {});
    localStorage.removeItem('fiddles');
    return { projects };
  } catch (error) {
    throw new Error(`Migration failed: ${error.message}`);
  }
};
