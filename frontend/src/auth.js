export const currentProfile = () => {
  try { return JSON.parse(localStorage.getItem("stayos_user") || "null"); } catch { return null; }
};
export const isOwner = () => currentProfile()?.role === "OWNER";
