import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddListButton from '../../components/buttons/AddListButton';
import Card from '../../components/Card';
import AddListModal from '../../components/modals/AddListModal';
import DeleteListModal from '../../components/modals/DeleteListModal';
import EditListModal from '../../components/modals/EditListModal';
import { createList, deleteList, getLists, updateList } from '../../lib/storage';

// Types
interface Item { id: string; title: string; amount: string; isChecked: boolean; }
interface List { id: string; title: string; items: Item[]; }

export default function Index() {
  const [lists, setLists] = useState<List[]>([]);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [editingList, setEditingList] = useState<List | null>(null);

  const fetchLists = useCallback(async () => {
    const storedLists = await getLists();
    setLists(storedLists);
  }, [fetchLists]);

  useEffect(() => { fetchLists(); }, [fetchLists]);

  const handleAddList = async (title: string) => {
    await createList(title);
    fetchLists();
    setAddModalVisible(false);
  };

  const handleDeleteList = async () => {
    if (selectedList) {
      await deleteList(selectedList.id);
      fetchLists();
      setDeleteModalVisible(false);
      setSelectedList(null);
    }
  };

  const handleEditList = async (listId: string, newTitle: string) => {
    await updateList(listId, { title: newTitle });
    fetchLists();
    setEditModalVisible(false);
    setEditingList(null);
  };

  const openDeleteModal = (list: List) => {
    setSelectedList(list);
    setDeleteModalVisible(true);
  };

  const openEditModal = (list: List) => {
    setEditingList(list);
    setEditModalVisible(true);
  };

  const renderRightActions = (list: List) => (
    <Pressable style={styles.deleteButton} onPress={() => openDeleteModal(list)}>
      <Text style={styles.deleteText}>Delete</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView>
        <View>
          <Text style={styles.text}>Shopping Lists</Text>
          {lists.map((list) => (
            <Swipeable key={list.id} renderRightActions={() => renderRightActions(list)}>
              <Card
                title={list.title}
                id={list.id}
                onLongPress={() => openEditModal(list)}
              />
            </Swipeable>
          ))}
        </View>
        <StatusBar barStyle="light-content" backgroundColor="#25292e" />
      </ScrollView>
      <AddListButton onPress={() => setAddModalVisible(true)} />

      <AddListModal
        visible={isAddModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSave={handleAddList}
      />

      <DeleteListModal
        visible={isDeleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onDelete={handleDeleteList}
        listTitle={selectedList?.title || ''}
      />

      <EditListModal
        visible={isEditModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSave={handleEditList}
        list={editingList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#25292e', alignContent: 'center', paddingTop: 20 },
  text: { color: '#E6E9ED', fontSize: 18, textAlign: 'left', marginLeft: 20, marginBottom: 10 },
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