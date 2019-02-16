/*
steps to run app 
first migrate smart contract into ganche
then use
"npm run dev"
to run a lite server and app runs on it but without connection with blockchain
Then use metamask to connect site with blockchain
put password simple for demonstration "123456"
right click chrome and click inspect to get errors
To change user simply add private key of the user to metamask "import account option"
private key can be copied from ganache
*/
App = {
  web3Provider: null,
  contracts: {},
  account: 0x0 ,

  init: function() {
  
    return App.initWeb3();
  },

  initWeb3: function() {
    /*
     * Replace me...
     connections between blockchain and webapp
     META MASK connects browser to blockchain
     */

     if(typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);

    } else{
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
      // 
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Record.json",function(record){
     //record.json contains compiled version of record.sol 
     // Instantiate a new truffle contract from the artifact
     App.contracts.Record = TruffleContract(record);
     // Connect provider to interact with contract
     App.contracts.Record.setProvider(App.web3Provider); 
     App.listenForEvents();
    return App.render();
    });
  },
  listenForEvents: function(){
    //console.log("yo");
    App.contracts.Record.deployed().then(function(instance) {
      //subscription for the votedEvent
      instance.reportedEvent({},{
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error,event) {
          console.log("Event triggerd ",event);
          //console.event(error);
          //action to be done if event is triggered
          App.render();
      });
    });
  },
// loader = $("#loader") it stores element with id loader
// getCoinbase gives current blockchain account
  render: function() {
    var recordInstance;
    var loader = $("#loader");
    var content = $("#content");
    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.Record.deployed().then(function(instance) {
      reportsInstance = instance;
      return reportsInstance.reportsCount();
    }).then(function(reportsCount) {
      var reportsUpdate = $("#reportsUpdate");
      reportsUpdate.empty();


      for (var i = 1; i <= reportsCount; i++) {
          reportsInstance.reports(i).then(function(report) {
          var rid = report[0];
          var date = report[1];
          var pname = report[2];
          var disease = report[3];
          var prescription = report[4];
          var gender = report[5];
          var age = report[6];
          var docid = report[7];
          var reportTemplate = "<tr><th>" + rid + "</th><td>" + date + "</td><td>" + pname + "</td><td>" + disease + "</td><td>" + prescription + "</td><td>" + gender + "</td><td>" + age + "</td><td>" + docid + "</td></tr>";
          reportsUpdate.append(reportTemplate);

        });
      }

      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  submitReport: function() {
    
    var date = $('#date').val();
    var pname = $('#pname').val();
    var disease = $('#disease').val();
    var prescription = $("#prescription").val();
    var gender = $('#gender').val();
    var age = $('#age').val();
    console.log("yo");

    App.contracts.Record.deployed().then(function(instance) {
      return instance.addReport(date,pname,disease,prescription,gender,age,{ from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }


};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
