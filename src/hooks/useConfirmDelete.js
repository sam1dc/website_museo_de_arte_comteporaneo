import { useState } from 'react';

export const useConfirmDelete = () => {
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    title: '',
    message: '',
    itemName: '',
    onConfirm: null
  });

  const confirmDelete = ({ title, message, itemName, onConfirm }) => {
    setDeleteDialog({
      open: true,
      title,
      message,
      itemName,
      onConfirm
    });
  };

  const handleConfirm = () => {
    if (deleteDialog.onConfirm) {
      deleteDialog.onConfirm();
    }
    setDeleteDialog({ ...deleteDialog, open: false });
  };

  const handleClose = () => {
    setDeleteDialog({ ...deleteDialog, open: false });
  };

  return {
    deleteDialog,
    confirmDelete,
    handleConfirm,
    handleClose
  };
};
