import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
// import Layout from "../../components/Layout";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  useDeleteSkinTypeMutation,
  useGetSkinTypesQuery,
} from "../../services";
import { useEffect, useRef, useState } from "react";
import { SkinType } from "../../entities/SkinType";
import { FormCreate, FormEdit } from "./components";
import Layout from "../../components/Layout";

const SkinTypePage = () => {
  const [isLoading, setIsLoading] = useState(false);

  type Modal = {
    create: boolean;
    edit: boolean;
    delete: false;
  };
  const [modal, setModal] = useState<Modal>({
    create: false,
    edit: false,
    delete: false,
  });
  const [selectedItem, setSelectedItem] = useState<SkinType>();

  const formCreateRef = useRef<any>();
  const formEditRef = useRef<any>();

  const query = new URLSearchParams();
  const { data, refetch } = useGetSkinTypesQuery(query);
  const [deleteRequest, { isLoading: isDeleteLoading, data: deleteData }] =
    useDeleteSkinTypeMutation();

  const handleModal = (key: keyof Modal, value: boolean) => {
    setModal({
      ...modal,
      [key]: value,
    });
  };

  const onEdit = (item: SkinType) => {
    setSelectedItem(item);
    handleModal("edit", true);
  };

  const onDelete = (item: SkinType) => {
    setSelectedItem(item);
    handleModal("delete", true);
  };

  const onCreateSuccess = () => {
    setIsLoading(false);
    handleModal("create", false);
    refetch();
  };

  const onUpdateSuccess = () => {
    setIsLoading(false);
    handleModal("edit", false);
    refetch();
  };

  const handleDeleteRequest = () => {
    if (selectedItem) {
      deleteRequest(selectedItem.id);
    }
  };

  useEffect(() => {
    if (deleteData) {
      refetch();
      handleModal("delete", false);
    }
  }, [deleteData]);

  return (
    <Layout>
      <Button variant="contained" onClick={() => handleModal("create", true)}>
        Add
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 5 }}>
        <Table sx={{ width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell>#ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>#Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <IconButton color="success" onClick={() => onEdit(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => onDelete(item)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={modal.create} onClose={() => handleModal("create", false)}>
        <DialogTitle>Add Skin Type</DialogTitle>
        <DialogContent>
          <FormCreate
            ref={formCreateRef}
            onSuccess={onCreateSuccess}
            onProcess={() => setIsLoading(true)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleModal("create", false)}>Cancel</Button>
          <Button
            disabled={isLoading}
            onClick={() => formCreateRef.current.submit()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={modal.edit} onClose={() => handleModal("edit", false)}>
        <DialogTitle>Edit Skin Type</DialogTitle>
        <DialogContent>
          <FormEdit
            ref={formEditRef}
            item={selectedItem}
            onSuccess={onUpdateSuccess}
            onProcess={() => setIsLoading(true)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleModal("edit", false)}>Cancel</Button>
          <Button
            disabled={isLoading}
            onClick={() => formEditRef.current.submit()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={modal.delete} onClose={() => handleModal("delete", false)}>
        <DialogTitle>Delete Skin Type</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this skin type?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleModal("delete", false)}>No</Button>
          <Button disabled={isDeleteLoading} onClick={handleDeleteRequest}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default SkinTypePage;