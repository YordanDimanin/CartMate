import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddNoteButton from '../components/buttons/AddNoteButton';
import AddNoteModal from '../components/modals/AddNoteModal';
import DeleteItemModal from '../components/modals/DeleteItemModal';
import EditNoteModal from '../components/modals/EditNoteModal';
import { addItemToList, deleteItemFromList, getList, updateItemInList } from '../lib/storage';

// Types
interface Item {
  id: string;
  title: string;
  amount: string;
  isChecked: boolean;
}

interface List {
  id: string;
  title: string;
  items: Item[];
}

// Main Component
export default function ListDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [list, setList] = useState<List | null>(null);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const fetchList = useCallback(async () => {
    const storedList = await getList(id);
    if (storedList) setList(storedList);
  }, [id]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleAddItem = async (item: { title: string; amount: string }) => {
    await addItemToList(id, item);
    fetchList();
    setAddModalVisible(false);
  };

  const handleToggleItem = async (itemId: string, isChecked: boolean) => {
    await updateItemInList(id, itemId, { isChecked: !isChecked });
    fetchList();
  };

  const handleDeleteItem = async () => {
    if (selectedItem) {
      await deleteItemFromList(id, selectedItem.id);
      fetchList();
      setDeleteModalVisible(false);
      setSelectedItem(null);
    }
  };

  const handleEditItem = async (item: { title: string; amount: string }) => {
    if (selectedItem) {
      await updateItemInList(id, selectedItem.id, item);
      fetchList();
      setEditModalVisible(false);
      setSelectedItem(null);
    }
  };

  const openDeleteModal = (item: Item) => {
    setSelectedItem(item);
    setDeleteModalVisible(true);
  };

  const openEditModal = (item: Item) => {
    setSelectedItem(item);
    setEditModalVisible(true);
  };

  if (!list) {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Text style={styles.title}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const renderRightActions = (item: Item) => {
    return (
      <Pressable onPress={() => openDeleteModal(item)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>{list.title}</Text>
      </View>

      <FlatList
        data={list.items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 200 }}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item)}>
            <Pressable
              style={styles.itemContainer}
              onPress={() => handleToggleItem(item.id, item.isChecked)}
              onLongPress={() => openEditModal(item)}
            >
              <Text style={[styles.itemText, item.isChecked && styles.itemTextChecked]}>
                {item.title}
              </Text>
              <Text style={[styles.itemAmount, item.isChecked && styles.itemTextChecked]}>
                {item.amount}
              </Text>
            </Pressable>
          </Swipeable>
        )}
      />

      <AddNoteButton onPress={() => setAddModalVisible(true)} />

      <AddNoteModal
        visible={isAddModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSave={handleAddItem}
      />

      <DeleteItemModal
        visible={isDeleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onDelete={handleDeleteItem}
        itemTitle={selectedItem?.title || ''}
      />

      <EditNoteModal
        visible={isEditModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSave={handleEditItem}
        item={selectedItem}
      />
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#25292E' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  title: { color: '#E6E9ED', fontSize: 24, fontWeight: 'bold' },
  itemContainer: {
    backgroundColor: '#3F454C',
    borderRadius: 10,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: { color: '#E6E9ED', fontSize: 18, flex: 1, marginRight: 10 },
  itemTextChecked: { textDecorationLine: 'line-through', color: '#888' },
  itemAmount: { color: '#a8aaadff', fontSize: 18 },
  deleteButton: {
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'flex-end',
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    paddingHorizontal: 20,
    flex: 1,
  },
  deleteText: { color: '#fff', fontWeight: 'bold' },
});
