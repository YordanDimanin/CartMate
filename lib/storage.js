import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'shoppingLists';

// Get all lists
export const getLists = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error loading lists:', e);
    return [];
  }
};

// Save all lists
export const saveLists = async (lists) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  } catch (e) {
    console.error('Error saving lists:', e);
  }
};

// Delete all lists
export const deleteLists = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error deleting lists:', e);
  }
};