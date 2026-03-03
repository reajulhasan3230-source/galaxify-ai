export const createUserProfile = async (uid, data) => {
  console.log("Creating profile for", uid, data);
  return true;
};

export const getPortfolioByUsername = async (username) => {
  // Mock data
  return {
    uid: username,
    displayName: 'Demo User',
    themeId: 'galaxy',
    plan: 'free',
    projects: [
      { title: "Project Alpha", description: "A cool 3D project" },
      { title: "Project Beta", description: "Another awesome app" }
    ]
  };
};