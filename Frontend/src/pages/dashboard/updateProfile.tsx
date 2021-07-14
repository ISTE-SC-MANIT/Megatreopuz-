import React from "react";
import { NextPage } from "next";

import { Formik, Form, Field, FieldProps } from "formik";
import {
  Typography,
  TextField,
  Box,
  Button,
  Grid,
  Container,
} from "@material-ui/core";
import { commit } from "../../components/Relay/mutations/UpdateUserMutation";
import { UserUpdateInput } from "../../__generated__/UpdateUserMutation.graphql";
import Drawer from "../../components/UserDashBoard/Drawer";
import { makeStyles, useTheme, Theme } from "@material-ui/core/styles";
import { ProtectedPageProps } from "../_app";
import { useRelayEnvironment, graphql, fetchQuery } from "relay-hooks";
import * as yup from "yup";
// import Autocomplete from "@material-ui/lab/Autocomplete";
// import { countries, countryToFlag } from "../../components/SignUp/countries";
// import Notification from "../../components/App/notification"
// import { type } from "os";
import {
  useSuccessNotification,
  useErrorNotification,
  useCustomNotification,
} from "../../components/App/useNotification";
// import Loader from "../../components/App/Loader";
import LinearLoader from "../../components/App/LinearLoader";
import {
  makeResolvable,
  ResolvablePromise,
} from "../../components/resolvablePromise";
import { completeDetailsUsernameCheckQuery } from "../../__generated__/completeDetailsUsernameCheckQuery.graphql";
// import { env } from "process";
import Username, { UsernameProps } from "../../components/SignUp/username";
import CustomDrawer from "../../components/UserDashBoard/CustomDrawer";

const useStyles = makeStyles((theme: Theme) => ({
  section: {
    minHeight: "100vh",

    backgroundAttachment: `fixed`,
    backgroundSize: `cover`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  option: {
    fontSize: 15,
    "& > span": {
      marginRight: 10,
      fontSize: 18,
    },
  },
  continer: {
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  figure: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  action: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: theme.spacing(2),
  },
  card: {
    opacity: 0.9,
    width: "80%",
    margin: "auto",
  },
  image: {
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  main: {
    height: "100vh",
  },
  heading: {
    // width: "fit-content",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(10),
    // fontFamily: "sans-serif",
  },
  submit_button: {
    margin: "auto",
    width: "60%",
  },
}));

const validationSchema = yup.object({
  name: yup.string().required("Name cannot be empty"),
  phone: yup.string().required("Phone number cannot be empty"),
  college: yup.string().required("College cannot be empty"),
  year: yup
    .number()
    .required("Year cannot be empty")
    .min(1, "Year cannot be less than 1"),
  country: yup.mixed().required("Country cannot be empty"),
});

const query = graphql`
  query updateProfileUsernameCheckQuery($username: String!) {
    checkUsername(username: $username) {
      available
    }
  }
`;

const Profile: NextPage<ProtectedPageProps> = ({
  viewer,
  refetch,
  ...props
}) => {
  const classes = useStyles();
  const environment = useRelayEnvironment();
  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const theme = useTheme();
  const showNotification = useCustomNotification();

  const initialValues: UserUpdateInput = {
    userName: viewer.userName,
    name: viewer.name,
    college: viewer.college,
    year: viewer.year,
    phone: viewer.phone,
    country: viewer.country,
  };
  const promiseMaker = React.useMemo(() => {
    return (username: string) =>
      makeResolvable<{ available: boolean; username: string }>(
        (resolve, reject) => {
          setDisabled(true);
          fetchQuery<completeDetailsUsernameCheckQuery>(
            environment,
            query,
            {
              username,
            },
            {
              force: true,
            }
          )
            .then((output) => {
              resolve({
                username,
                available: output.checkUsername.available,
              });
            })
            .catch(reject)
            .finally(() => setDisabled(false));
        }
      );
  }, [environment]);

  const [usernameState, setUsernameState] = React.useState<
    UsernameProps["state"]
  >("null");
  const currentPromise = React.useRef<null | ResolvablePromise<{
    available: boolean;
    username: string;
  }>>(null);

  const currentUsername = React.useRef<string>("");

  const validateUsername: (
    value: string
  ) => Promise<string | undefined> = React.useMemo(() => {
    return async (username: string) => {
      if (currentUsername.current === username) {
        return undefined;
      }
      currentUsername.current = username;
      currentPromise.current?.resolve({
        available: true,
        username: "",
      });

      if (!username) {
        setUsernameState("null");
        return undefined;
      }

      setUsernameState("loading");
      currentPromise.current = promiseMaker(username);
      try {
        const { available, username: oldUsername } = await currentPromise
          .current.promise;
        if (!oldUsername) return undefined;
        setUsernameState(available ? "valid" : "unavailable");
        return undefined;
      } catch (e) {
        return "Could not validate username";
      }
    };
  }, [promiseMaker]);

  const handleSubmit = (values: UserUpdateInput) => {
    setLoading(true);

    commit(environment, values, viewer.id, {
      onError: (err) => {
        showNotification(err.message, "error");
        setLoading(false);
      },
      onCompleted: () => {
        showNotification("User was successfully Updated", "success");
        refetch();
        setLoading(false);
      },
    });
  };

  return (
    <section className={classes.section}>
      <LinearLoader loading={loading} />
      {/* <Drawer name={viewer.name} username={viewer.userName} /> */}
      <CustomDrawer
        name={viewer.name}
        username={viewer.userName}
        page={"Profile"}
      />
      <Container className={classes.main}>
        <Box
          className={classes.heading}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h3" align="center">
            Update Your Profile
          </Typography>
        </Box>
        <Grid container>
          <Grid xs={12} md={5} item>
            <Box>
              <img
                src={
                  theme.palette.type === "light"
                    ? "/updateDark.svg"
                    : "/updateWhite.svg"
                }
                className={classes.image}
              ></img>
            </Box>
          </Grid>
          <Grid xs={12} md={7} item>
            <Formik
              validationSchema={validationSchema}
              onSubmit={(values) => handleSubmit(values)}
              initialValues={initialValues}
            >
              <Form id="updateform">
                <Field name="name">
                  {({
                    field,
                    meta,
                  }: FieldProps<typeof initialValues["name"]>) => (
                    <TextField
                      fullWidth
                      id="name-input"
                      label="Name"
                      required
                      {...field}
                      error={!!(meta.touched && meta.error)}
                      helperText={meta.touched ? meta.error : ""}
                    />
                  )}
                </Field>
                <Field name="userName" validate={validateUsername}>
                  {({
                    field,
                    meta,
                  }: FieldProps<typeof initialValues["userName"]>) => (
                    // <Username
                    //   fullWidth
                    //   error={!!(meta.touched && meta.error)}
                    //   helperText={meta.touched && meta.error}
                    //   state={usernameState}
                    //   disabled
                    //   {...field}
                    // />
                    <TextField
                      fullWidth
                      id="username-input"
                      label="Username"
                      required
                      disabled
                      {...field}
                      error={!!(meta.touched && meta.error)}
                      helperText={meta.touched ? meta.error : ""}
                    />
                  )}
                </Field>
                <Field name="year">
                  {({
                    field,
                    meta,
                  }: FieldProps<typeof initialValues["year"]>) => (
                    <TextField
                      fullWidth
                      type="number"
                      id="year-input"
                      label="Year"
                      required
                      {...field}
                      error={!!(meta.touched && meta.error)}
                      helperText={meta.touched ? meta.error : ""}
                    />
                  )}
                </Field>
                <Field name="country">
                  {({
                    field,
                    meta,
                  }: FieldProps<typeof initialValues["country"]>) => (
                    <TextField
                      fullWidth
                      id="college-input"
                      label="Country"
                      required
                      {...field}
                      error={!!(meta.touched && meta.error)}
                      helperText={meta.touched ? meta.error : ""}
                    />
                  )}
                </Field>
                <Field name="college">
                  {({
                    field,
                    meta,
                  }: FieldProps<typeof initialValues["college"]>) => (
                    <TextField
                      fullWidth
                      id="college-input"
                      label="College"
                      required
                      {...field}
                      error={!!(meta.touched && meta.error)}
                      helperText={meta.touched ? meta.error : ""}
                    />
                  )}
                </Field>
                <Field name="phone">
                  {({
                    field,
                    meta,
                  }: FieldProps<typeof initialValues["phone"]>) => (
                    <TextField
                      fullWidth
                      id="phone-input"
                      label="Phone"
                      required
                      {...field}
                      error={!!(meta.touched && meta.error)}
                      helperText={meta.touched ? meta.error : ""}
                    />
                  )}
                </Field>
              </Form>
            </Formik>
            <Box
              mt={2}
              mb={2}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Button
                className={classes.submit_button}
                type="submit"
                form="updateform"
                variant="contained"
                color="primary"
              >
                Update
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* <Paper elevation={3} variant="elevation" className={classes.card}>
                <Card >
                    <CardHeader
                        title={<Typography

                            align="center"
                            variant="h4">
                            Update Your Megatreopuz Profile Info
                            </Typography>

                        }
                        subheader={
                            <Typography
                                component="h1"
                                align="center"
                                variant="subtitle2">
                                Lorem Ipsum
                                </Typography>
                        }></CardHeader>
                    <CardContent>

                    </CardContent>
                    <CardActions className={classes.action}> <Button type="submit" form="updateform" variant="contained" color="primary">Update</Button></CardActions>

                </Card>
            </Paper> */}
      </Container>
    </section>
  );
};

export default Profile;
{
  /* <Formik
validationSchema={validationSchema}
onSubmit={(values) => handleSubmit(values)}
initialValues={initialValues}>
<Form id="updateform">
    <Field name="name">
        {({
            field,
            meta,
        }: FieldProps<typeof initialValues["name"]>) => (
                <TextField

                    id="name-input"
                    label="Name"
                    required
                    {...field}
                    error={!!(meta.touched && meta.error)}
                    helperText={meta.touched ? meta.error : ""}
                />
            )}
    </Field>
    <Field name="userName" validate={validateUsername}>
        {({
            field,
            meta,
        }: FieldProps<typeof initialValues["userName"]>) => (
                <Username

                    error={!!(meta.touched && meta.error)}
                    helperText={meta.touched && meta.error}
                    state={usernameState}
                    {...field}
                />
            )}
    </Field>
    <Field name="year">
        {({
            field,
            meta,
        }: FieldProps<typeof initialValues["year"]>) => (
                <TextField

                    type="number"
                    id="year-input"
                    label="Year"
                    required
                    {...field}
                    error={!!(meta.touched && meta.error)}
                    helperText={meta.touched ? meta.error : ""}
                />
            )}
    </Field>
    <Field name="country">
        {({
            field,
            meta,
        }: FieldProps<typeof initialValues["country"]>) => (
                <TextField

                    id="college-input"
                    label="Country"
                    required
                    {...field}
                    error={!!(meta.touched && meta.error)}
                    helperText={meta.touched ? meta.error : ""}
                />
            )}
    </Field>
    <Field name="college">
        {({
            field,
            meta,
        }: FieldProps<typeof initialValues["college"]>) => (
                <TextField

                    id="college-input"
                    label="Colllege"
                    required
                    {...field}
                    error={!!(meta.touched && meta.error)}
                    helperText={meta.touched ? meta.error : ""}
                />
            )}
    </Field>
    <Field name="phone">
        {({
            field,
            meta,
        }: FieldProps<typeof initialValues["phone"]>) => (
                <TextField

                    id="phone-input"
                    label="Phone"
                    required
                    {...field}
                    error={!!(meta.touched && meta.error)}
                    helperText={meta.touched ? meta.error : ""}
                />
            )}
    </Field>

</Form>

</Formik> */
}
