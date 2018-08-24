const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

client.ping((error) => {
    if (error) {
      console.trace('elasticsearch cluster is down!');
    } console.log('All is well');
  });
function checkIndices() {
    client.indices.exists({index: 'users'}, (err, res, status) => {
        if (res) {
            console.log('index already exists');
        } else {
          client.indices.create( {index: 'users'}, (err, res, status) => {
            console.log(err, res, status);
        })
      }
        
    })
}

async function getUsers() {
    await client.search({
        index: 'users',
        type: 'staff',
        body: {
          query: {
            match: {
              body: 'firstname'
            }
          }
        }
    })
    .then(res => console.log(res))
    .catch(err => console.log(err));
};


async function putMapping () {
    console.log("Creating Mapping index");
    client.indices.putMapping({
        index: 'users',
        type: 'staff',
        body: {
        properties: { 
            firstname: { type: 'text' },
            lastname: { type: 'text' },
            email: { type: 'text' },
            phone_number: { type: 'text' },
            created_on: { type: 'date' },
            updated_at: { type: 'date' } }
        }
    }, (err,resp, status) => {
        if (err) {
          console.error(err, status);
        }
        else {
            console.log('Successfully Created Index', status, resp);
        }
    });
}

//putMapping();
checkIndices();
//getUsers();