import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

type Props = {
  onPress: () => void;
};

const AddNoteButton = ({ onPress }: Props) => {
  return (
    <Pressable style={styles.fab} onPress={onPress}>
      <Ionicons name="add-circle" size={80} color="#3DA35D" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 120,
    right: 20,
  },
});

export default AddNoteButton;