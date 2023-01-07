import Joi from "@hapi/joi";

const userValidationSchema = Joi.object({
    firstName: Joi.string().required().min(2).label("Name").regex(/^[A-Za-z]+$/).messages({
        "string.pattern.base": "The name field can not include numbers and special characters",
        "string.empty": "The name field can not be empty"
    }),

    lastName: Joi.string().required().min(2).label("Name").regex(/^[A-Za-z]+$/).messages({
        "string.pattern.base": "The name field can not include numbers and special characters",
        "string.empty": "The name field can not be empty"
    }),

    medicalCareer: Joi.string().required().regex(/^[A-Za-z]+$/).messages({
        "string.pattern.base": "The name field can not include numbers and special characters",
        "string.empty": "The name field can not be empty"
    }),

    email: Joi.string().required().email().messages({
        "string.email": "Invalid email",
        "string.empty": "The email field can not be empty"
    }),

    password: Joi.string().required().regex(/^(?=(.*[A-Z]){1,})(?=(.*[a-z]){1,})(?=(.*[0-9]){1,}).{5,}$/).messages({
        "string.pattern.base": "The password should have at least one capital letter and a number",
        "string.empty": "The password field can not be empty"
    }),

    repeatPassword: Joi.string().required().equal(Joi.ref("password")).messages({
        "any.only": "Passwords don't match"
    })
})


export default userValidationSchema




// import tensorflow as tf

// # Load the dataset of chest X-rays
// x_train, y_train = load_chest_xray_data(training=True)
// x_test, y_test = load_chest_xray_data(training=False)

// # Preprocess the data by standardizing the images and extracting features
// x_train = preprocess_data(x_train)
// x_test = preprocess_data(x_test)

// # Define the model architecture
// model = tf.keras.Sequential([
//     # Use a convolutional layer to extract features from the images
//     tf.keras.layers.Conv2D(32, (3, 3), activation="relu", input_shape=(64, 64, 3)),
//     # Use max pooling to reduce the dimensionality of the features
//     tf.keras.layers.MaxPooling2D((2, 2)),
//     # Use another convolutional layer with more filters to learn more complex features
//     tf.keras.layers.Conv2D(64, (3, 3), activation="relu"),
//     # Use max pooling again
//     tf.keras.layers.MaxPooling2D((2, 2)),
//     # Flatten the extracted features to a 1D vector
//     tf.keras.layers.Flatten(),
//     # Use a dense layer to learn a prediction from the extracted features
//     tf.keras.layers.Dense(64, activation="relu"),
//     # Use a final dense layer with a sigmoid activation function to output the probability of TB
//     tf.keras.layers.Dense(1, activation="sigmoid")
// ])

// # Compile the model with a binary cross-entropy loss function and an Adam optimizer
// model.compile(loss="binary_crossentropy", optimizer="adam", metrics=["accuracy"])

// # Train the model on the training dataset
// model.fit(x_train, y_train, epochs=10, batch_size=32)

// # Evaluate the model on the test dataset
// model.evaluate(x_test, y_test)

// # Use the trained model to make predictions on new chest X-rays
// predictions = model.predict(x_new)
