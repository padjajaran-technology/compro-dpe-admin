import {useFormik} from "formik";
import React, {useEffect} from "react";
import {ImagePicker} from "../../../components/ImagePicker";
import {usePostBannerMutation} from "../../../services";
import {Box, Button, Grid, Input, InputWrapper, Modal} from "@mantine/core";
import {TextField} from "@mui/material";

type FormCreateProp = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

const FormCreate = (props: FormCreateProp) => {
  const {open, onClose, onCreated} = props;

  const [onSubmit, {data}] = usePostBannerMutation();

  const {values, errors, setFieldValue, submitForm} = useFormik({
    initialValues: {
      title: "",
      subTitle: "",
      imageSource: "",
    },
    onSubmit,
  });

  useEffect(() => {
    if (data) {
      onCreated();
    }
  }, [data, onCreated]);

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title="Add New Product"
      size="xl"
    >

      <Box
        sx={(theme) => ({
          marginTop: theme.spacing.md
        })}
      >
        <Grid>
          <Grid.Col>
            <InputWrapper
              required
              label="Title"
              error={errors.title}
            >
              <Input
                value={values.title}
                onChange={(e: any) => setFieldValue("title", e.target.value)}
              />
            </InputWrapper>
          </Grid.Col>

          <Grid.Col>
            <InputWrapper
              required
              label="Sub Title"
              error={errors.subTitle}
            >
              <Input
                value={values.subTitle}
                onChange={(e: any) => setFieldValue("subTitle", e.target.value)}
              />
            </InputWrapper>
          </Grid.Col>

          <Grid.Col>
            <InputWrapper
              required
              label="Image"
              error={errors.imageSource}
            >
              <ImagePicker result={(e) => setFieldValue("imageSource", e)}/>
            </InputWrapper>
          </Grid.Col>
        </Grid>
      </Box>

      <Box
        sx={(theme) => ({
          marginTop: theme.spacing.md,
          display: 'flex',
          justifyContent: 'end',
          gap: theme.spacing.md
        })}
      >
        <Button onClick={onClose} color="gray">Cancel</Button>
        <Button type="button" onClick={submitForm}>
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default FormCreate;
