function migrateProject(key) {
  try {
    const json = localStorage.getItem(key);
    const project = JSON.parse(json);
    // localStorage.removeItem(key); // TODO enable this
    return project;
  } catch (error) {
    console.warn('Migration failed: ', error);
  }
}

export default function() {
  const json = localStorage.getItem('fiddles');
  if (!json) return;
  try {
    const keys = JSON.parse(json);
    const projects = keys.map(migrateProject)
      .filter(project => project)
      .reduce((projects, project) => {
        projects[project.key] = project;
        return projects;
      }, {});
    // localStorage.removeItem('fiddles'); // TODO enable this
    return { projects };
  } catch (error) {
    console.warn('Migration failed: ', error);
  }
};
