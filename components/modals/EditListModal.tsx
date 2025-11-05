import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

interface EditListModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (listId: string, newTitle: string) => void;
  list: { id: string; title: string } | null;
}

const EditListModal: React.FC<EditListModalProps> = ({ visible, onClose, onSave, list }) => {
  const [newTitle, setNewTitle] = useState(list?.title || '');

  useEffect(() => {
    if (list) {
      setNewTitle(list.title);
    } else {
      setNewTitle('');
    }
  }, [list]);

  const handleSave = () => {
    if (list && newTitle.trim() !== '') {
      onSave(list.id, newTitle.trim());
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit List Name</Text>

          <TextInput
            style={styles.input}
            onChangeText={setNewTitle}
            value={newTitle}
            placeholder="New list name"
            placeholderTextColor="#888"
          />

          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.actionButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>

            <Pressable
              style={[styles.actionButton, styles.confirmButton]}
              onPress={handleSave}
            >
              <Ionicons name="checkmark" size={22} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#25292E',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#333840',
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#444A52',
  },
  confirmButton: {
    backgroundColor: '#3DA35D',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default EditListModal;