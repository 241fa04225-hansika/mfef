
function getHistoryKey() {
  try {
    const user = JSON.parse(
      localStorage.getItem("understandx_current_user") || "null"
    );

    if (!user) return null;

    const userId =
      user._id || user.id || user.email || user.username;

    if (!userId) return null;

    return `understandx_learning_history_${String(userId).toLowerCase()}`;
  } catch (error) {
    console.error("Could not identify current user:", error);
    return null;
  }
}

export function getLearningHistory() {
  try {
    const key = getHistoryKey();
    if (!key) return [];

    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (error) {
    console.error("Could not load learning history:", error);
    return [];
  }
}

export function saveLearningActivity(activity) {
  try {
    const key = getHistoryKey();

    if (!key) {
      console.warn("Please log in before saving learning history.");
      return false;
    }

    const history = JSON.parse(localStorage.getItem(key) || "[]");

    const title =
      activity.title.length > 70
        ? `${activity.title.slice(0, 70)}...`
        : activity.title;

    const exists = history.some(
      (item) =>
        item.type === activity.type &&
        item.subject === activity.subject &&
        item.title === title
    );

    if (exists) return true;

    history.unshift({
      id: `learning-${Date.now()}`,
      ...activity,
      title,
      date: new Date().toISOString(),
    });

    localStorage.setItem(key, JSON.stringify(history));

    window.dispatchEvent(new Event("understandx-history-updated"));

    return true;
  } catch (error) {
    console.error("Could not save learning activity:", error);
    return false;
  }
}

export function clearLearningHistory() {
  const key = getHistoryKey();

  if (!key) return;

  localStorage.removeItem(key);
  window.dispatchEvent(new Event("understandx-history-updated"));
}
