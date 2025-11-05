import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddNoteButton from '../components/buttons/AddNoteButton';
import AddNoteModal from '../components/modals/AddNoteModal';
import DeleteItemModal from '../components/modals/DeleteItemModal';
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
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const fetchList = useCallback(async () => {
    const storedList = await getList(id);
    if (storedList) {
      setList(storedList);
    }
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

  const openDeleteModal = (item: Item) => {
    setSelectedItem(item);
    setDeleteModalVisible(true);
  };

  if (!list) {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Text style={styles.title}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.header}>
        {/* <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>Back</Text>
        </Pressable> */}
        <Text style={styles.title}>{list.title}</Text>
      </View>

      <FlatList
        data={list.items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.itemContainer}
            onPress={() => handleToggleItem(item.id, item.isChecked)}
            onLongPress={() => openDeleteModal(item)}>
            <Text style={[styles.itemText, item.isChecked && styles.itemTextChecked]}>
              {item.title}
            </Text>
            <Text style={[styles.itemAmount, item.isChecked && styles.itemTextChecked]}>
              {item.amount}
            </Text>
          </Pressable>
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
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#25292E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    color: '#3DA35D',
    fontSize: 18,
    marginRight: 20,
  },
  title: {
    color: '#E6E9ED',
    fontSize: 24,
    fontWeight: 'bold',
  },
  itemContainer: {
    backgroundColor: '#3F454C',
    borderRadius: 10,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    // flexWrap: 'wrap',
  },
  itemText: {
    color: '#E6E9ED',
    fontSize: 18,
    maxWidth: '70%',
  },
  itemTextChecked: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  itemAmount: {
    color: '#a8aaadff',
    fontSize: 18,
    marginLeft: 15,
    maxWidth: '30%',
  },
});
