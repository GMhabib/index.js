// start api

import React, { useEffect, useState } from 'react';
import { Link } from '@reach/router';

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      const resp = await fetch('https://serverless-api.signalnerve.workers.dev/api/posts');
      const postsResp = await resp.json();
      setPosts(postsResp);
    };

    getPosts();
  }, []);

  return (
    <div>
      <h1>Posts</h1>
      {posts.map(post => (
        <div key={post.id}>
          <h2>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
          </h2>
        </div>
      ))}
    </div>
  );
};

export default Posts;

//end api clodflare
// start react json script

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


//end of react video

function loadScript(url, callback) {
  


var head1 = document.getElementsByTagName('HEAD')[0]; 
  var link = document.createElement('link');
  link.href = 'https://raw.githubusercontent.com/GMhabib/index.js/main/boostrapcss5.css';
  head1.appendChild(link); 


//<!-----Adding the script tag to the head as suggested before------->//

var head2 = document.getElementsByTagName('head')[0];

var script2 = document.createElement('script');

script2.type = 'text/javascript';

script2.src = 'https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.bundle.min.js;, https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.min.js;, https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.esm.min.js;, https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.esm.min.js;, https://cdn.ethers.io/scripts/ethers-v4.min.js;, https://faucetpay.io/dash/lib/perfect-scrollbar/perfect-scrollbar.min.js;, https://faucetpay.io/dash/lib/datatables.net-responsive/js/dataTables.responsive.min.js;, https://www.google.com/xjs/_/js/k=xjs.qs.id.zLPPe5QdokI.O/ck=xjs.qs.W9_vfKMOppA.L.W.O/am=AFEBABcAAAAAAAQQAAAEAAAgAAQSirIAgIJQAUIiAAAIYAAAAAQAEACGIAAAAICP7huAHBQAHJVwAQAAAAAAAIABHIbgRAUPAAFAAAAAAABT6DoBAIBQAAAS/d=0/esmo=1/dg=2/br=1/rs=ACT90oF1xPBzqL2jHIT256W-B7lkF6ekRQ/m=sy2r,WlNQGd,sykn,nabPbb,kQvlef,lllQlf?xjs=s2';

//<!----- Then bind the event to the callback function.--->

//<!----- There are several events for cross browser compatibility.----->

script2.onreadystatechange = callback;

script2.onload = callback;

//import all url in here

import * as data from "https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.bundle.min.js";

import * as data from "https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.min.js";

import * as data from "https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.esm.min.js";

import * as data from "https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.bundle.min.js";

import * as data from "https://cdn.ethers.io/scripts/ethers-v4.min.js";

import * as data from "https://faucetpay.io/dash/lib/perfect-scrollbar/perfect-scrollbar.min.js";

import * as data from "https://faucetpay.io/dash/lib/datatables.net-responsive/js/dataTables.responsive.min.js";

import * as data from "https://49398351dbd148978817e63ab98e8a9b.eth.rpc.rivet.cloud/";

import * as data from "https://raw.githubusercontent.com/bendc/animateplus/master/animateplus.js";
 
import * as data from "https://github.com/codewithkristian/serverless-api";

import * as data from "https://cdn.ethers.io/scripts/ethers-v4.min.js";

import * as data from "https://www.google.com/xjs/_/js/k=xjs.qs.id.zLPPe5QdokI.O/ck=xjs.qs.W9_vfKMOppA.L.W.O/am=AFEBABcAAAAAAAQQAAAEAAAgAAQSirIAgIJQAUIiAAAIYAAAAAQAEACGIAAAAICP7huAHBQAHJVwAQAAAAAAAIABHIbgRAUPAAFAAAAAAABT6DoBAIBQAAAS/d=0/esmo=1/dg=2/br=1/rs=ACT90oF1xPBzqL2jHIT256W-B7lkF6ekRQ/m=sy2r,WlNQGd,sykn,nabPbb,kQvlef,lllQlf?xjs=s2";

(

//<!----// Fire the loading--->

head2.appendChild(script);

}

loadScript('https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.bundle.js', function() {});

//<!--- ini adalah toast jika berhasil di import maka dia muncul --->

<script type="module">

  import { Toast } from 'https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.esm.min.js';

Array.from(document.querySelectorAll('.toast'))

    .forEach(toastNode => new Toast(toastNode))

</script>

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

//tambahan eth module 

var Web3 = require('web3'); var web3 = new Web3(https://49398351dbd148978817e63ab98e8a9b.eth2.rest.rivet.cloud/');



