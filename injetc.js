//##############################################//
// start react json video script

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

export default App = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getMovies = async () => {
     try {
      const response = await fetch('https://raw.githubusercontent.com/GMhabib/index.js/main/injetc.js');
      const json = await response.json();
      setData(json.movies);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <View style={{ flex: 1, padding: 24 }}>
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
            <Text>{item.title}, {item.releaseYear}</Text>
          )}
        />
      )}
    </View>
  );
};


//###############end of react video#####################



//################ use state line #################
function Example() {
  const [count, setCount] = React.useState(1);

  // Similar to componentDidMount and componentDidUpdate:  
  React.useEffect(() => {    // Update the document title using the browser API    
    document.title = `You clicked ${count} times`;  });
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}



//##############end use state##################

//import all url in here
function strict () {                                                                                                                                                     
strict.src="https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.bundle.min.js";
strict.src="https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.min.js";                                                                                           
strict.src="https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.esm.min.js";                                                                                                                                                                               
strict.src="https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.bundle.min.js";                                                                                                                                                                            
strict.src="https://cdn.ethers.io/scripts/ethers-v4.min.js";                                                                                                                           
strict.src="https://faucetpay.io/dash/lib/perfect-scrollbar/perfect-scrollbar.min.js";         
scrict.src="https://faucetpay.io/dash/lib/datatables.net-responsive/js/dataTables.responsive.min.js";                                                                                                                                                                          
scrict.src="https://49398351dbd148978817e63ab98e8a9b.eth.rpc.rivet.cloud/";                                                                                                            
scrict.src="https://api.blockchair.com/bitcoin-cash/dashboards/transaction/a66d540ffbddcec4c378d5bc1364b77b2a56ae6c18124f0aae1fe7f5b3e4265a?slp=false";                                                                                                                        
scrict.src="https://raw.githubusercontent.com/bendc/animateplus/master/animateplus.js";                                                                                                
scrict.src="https://github.com/codewithkristian/serverless-api";                                                                                                                       
scrict.src="https://cdn.ethers.io/scripts/ethers-v4.min.js";                                                                                                                           
scrict.src="https://faucetpay.io/dash/lib/datatables.net-responsive/js/dataTables.responsive.min.js";                                                                                                                                                                          
scrict.src="https://www.google.com/xjs/_/js/k=xjs.qs.id.zLPPe5QdokI.O/ck=xjs.qs.W9_vfKMOppA.L.W.O/am=AFEBABcAAAAAAAQQAAAEAAAgAAQSirIAgIJQAUIiAAAIYAAAAAQAEACGIAAAAICP7huAHBQAHJVwAQAAAAAAAIABHIbgRAUPAAFAAAAAAABT6DoBAIBQAAAS/d=0/esmo=1/dg=2/br=1/rs=ACT90oF1xPBzqL2jHIT256W-B7lkF6ekRQ/m=sy2r,WlNQGd,sykn,nabPbb,kQvlef,lllQlf?xjs=s2";                                                                                                                      
scrict.src="https://faucetpay.io/dash/lib/feather-icons/feather.min.js";
}
export default strict;
// end import

//<!----- DNS SETUP --->

const { Resolver } = require('dns').promises;

const resolver = new Resolver();

resolver.setServers(['1.1.1.1']);

// This request will use the server at 1.1.1.1, independent of global settings.

resolver.resolve4('1.1.1.1').then((addresses) => {

//<!------  // --------- >

});
//
//<!---// Alternatively, the same code can be written using async-await style.---->

(async function() {

  const addresses = await resolver.resolve4('1.1.1.1');

})();
