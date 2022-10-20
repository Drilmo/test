const userTable = process.env.USER_TABLE;

const uuid = require("uuid");
const AWS = require("aws-sdk");

let options = {};
if (process.env.IS_OFFLINE) {
  options = {
    region: "localhost",
    endpoint: "http://localhost:" + process.env.LOCAL_DYNAMODB_PORT,
  };
}

const dynamoDb = new AWS.DynamoDB.DocumentClient(options);

const createUser = async (input) => {
  console.log("createUser");
  let item = {
    id: uuid.v4(),
  };
  for (let key in input) {
    item[key] = input[key];
  }

  const params = {
    TableName: userTable,
    Item: item,
    ReturnValues: "ALL_OLD",
  };
  console.log("params: ", params);
  return new Promise((resolve, reject) => {
    dynamoDb.put(params, (err, data) => {
      if (err) {
        // log l'erreur
        console.log("error: ", err);
        reject(false);
      } else {
        console.log("Resolve: ", data);
        let User = getUser(params.Item.id, false);
        resolve(User);
      }
    });
  });
};

// deleteUser by id
const deleteUser = async (id) => {
  await getUser(id, false);
  const params = {
    TableName: userTable,
    Key: {
      id: id,
    },
  };
  return new Promise((resolve, reject) => {
    dynamoDb.delete(params, (err, data) => {
      if (err) {
        console.log("error: ", err);
        reject(false);
      } else {
        console.log("Resolve: ", data);
        resolve(true);
      }
    });
  });
};

// updateUser and return the updated item
const updateUser = async (id, input) => {
  await getUser(id, false);

  //construction de la requete d'update
  let updateExpression = "set ";
  let expressionAttributeValues = {};
  let expressionAttributeNames = {};
  for (let key in input) {
    if (key !== "id") {
      expressionAttributeValues[`:${key}`] = input[key];
      expressionAttributeNames[`#${key}`] = key;
      updateExpression += `#${key} = :${key}, `;
    }
  }

  const params = {
    TableName: userTable,
    Key: {
      id: id,
    },
    UpdateExpression: updateExpression.slice(0, -2),
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };
  console.log("params: ", params);
  return new Promise((resolve, reject) => {
    dynamoDb.update(params, (err, data) => {
      if (err) {
        // log l'erreur
        console.log("error: ", err);
        reject(false);
      } else {
        console.log("Resolve: ", data);
        resolve(data.Attributes);
      }
    });
  });
};

// getUser
const getUser = async (id, checkIfExist) => {
  let user;
  user = await getUserById(id);
  console.log("user: ", user);
  if (user !== undefined && user !== null) {
    if (checkIfExist) {
      throw new Error(
        "User id:'" + id + "' already exist"
      );
    } else {
      return user;
    }
  } else {
    if (!checkIfExist) {
      throw new Error("User id: '" + id + "' not found.");
    } else {
      return null;
    }
  }
};

const getUserById = (id) => {
  const params = {
    TableName: userTable,
    Key: { id },
  };
  console.log("params: ", params);
  return new Promise((resolve, reject) => {
    dynamoDb.get(params, (err, data) => {
      if (err) {
        console.log("error: ", err);
        reject(false);
      } else {
        console.log("Resolve: ", data);
        resolve(data.Item);
      }
    });
  });
};


const getAllUser = () => {
  const params = {
    TableName: userTable,
  };
  console.log("params: ", params);
  return new Promise((resolve, reject) => {
    dynamoDb.scan(params, (err, data) => {
      if (err) {
        console.log("error: ", err);
        reject(false);
      } else {
        console.log("Resolve: ", data);
        resolve(data.Items);
      }
    });
  });
};

module.exports = {
  createUser: createUser,
  deleteUser: deleteUser,
  updateUser: updateUser,
  getUser: getUser,
  getAllUser: getAllUser,
  getUserById: getUserById
};
