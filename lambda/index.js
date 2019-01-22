
const Alexa = require('ask-sdk-core');



//____________________________________________________ Launch Intent handler______________________________________________

const LaunchRequest = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;

    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.NavigateHomeIntent');
  },
  handle(handlerInput) {
    
    let sessionAttributes = {};
    
    Object.assign(sessionAttributes, {
        intent : "launch"
    });
  
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    
    let dataAPL = require('./dataAPL.json');
    
    return handlerInput.responseBuilder
      .speak("Welcome to Paradise Explorer. India is known as a paradise on Earth, due to its rich culture, traditions, religions, history, and mesmerising natural beauty. This skill helps you explore the incredible Indian sub continent in different ways. Say help, any time you need my help. So, Shall we start our journey ? ")
      .reprompt('Shall I start ?')
      .addDirective({
          type : 'Alexa.Presentation.APL.RenderDocument',
          document : require('./imageAPL.json'),
          datasources : dataAPL.data[0]
      })
      .withSimpleCard('Welcome to Paradise Explore.r')
      .getResponse();
  },
};

//_____________________________________________________function explorer__________________________________________________

function explorer(handlerInput,count){
 
  let popularData;
  let doc ;
  var resp;
  
  let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  
    let regi = sessionAttributes.region;
    let exp = sessionAttributes.explore;
    
    if(exp=='popular'||exp=='popular destination'||exp=='destination'||exp=='popular destinations'||exp=='destinations'){
      
      popularData = require("./popular.json");
      doc = require('./sixpager.json');
      resp = popularData[regi][count].recipe.properties.initial.dest;
    }
    else if(exp=='food'||exp=='cuisine'||exp=='cuisines'||exp=='food and cuisines'||exp=='food and cuisine'){
      
       popularData = require("./food.json");
       doc = require('./onepager.json');
       resp = popularData[regi][count].recipe.properties.initial.shorttext;
    }
    else if(exp=='heritage'||exp=='heritage site'||exp=='heritage sites'||exp=='site'||exp=='sites'){
      
      popularData = require("./heritage.json");
      doc = require('./oneHeritage.json');
      resp = popularData[regi][count].recipe.properties.initial.shorttext;
    
      
    }
    
    
    console.log('count ::' + count);
    console.log('region ::'+ regi);
    console.log('dataFromFile ::'+ JSON.stringify(popularData[regi][count]));
   
  
    return handlerInput.responseBuilder
      .speak(resp)
      .reprompt(resp)
      .addDirective({
          type : 'Alexa.Presentation.APL.RenderDocument',
          document : doc,
          datasources : popularData[regi][count]
      })
      .getResponse();

}

//________________________________________________ExploreHandler Intent_________________________________________________

const ExploreHandler = {
  
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest' 
    && handlerInput.requestEnvelope.request.intent.name === 'exploreIntent') 
    || (handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent' 
    && handlerInput.requestEnvelope.request.arguments[0] === 'exploreEvent');
  },
  handle(handlerInput) {
    
    const request = handlerInput.requestEnvelope.request;
    
    if( request.type === 'IntentRequest'){
      let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
      let exploreVal = handlerInput.requestEnvelope.request.intent.slots.exploreSlot.value;
      let count = 0;
      
      if(!sessionAttributes.region){
        
        let doc = require('./regionAPL.json');
  
      return handlerInput.responseBuilder
        .speak("Choose a region first")
        .reprompt('Choose a region first')
        .addDirective({
          type : 'Alexa.Presentation.APL.RenderDocument',
          document : doc,
          datasources : {}
        })
        .getResponse();
      }
    
      Object.assign(sessionAttributes, {
        intent: "explore",
        region: sessionAttributes.region,
        explore: exploreVal,
        counter: count
      });
  
      handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
      console.log('explore_selected :: '+ exploreVal);
      
      
      if(exploreVal=='popular destination'||exploreVal=='popular destinations'||exploreVal=='popular'||exploreVal=='destination'||exploreVal=='destinations'
      ||exploreVal=='food'||exploreVal=='cuisine'||exploreVal=='cuisines'||exploreVal=='food and cuisine'||exploreVal=='food and cuisines'
      ||exploreVal=='heritage sites'||exploreVal=='heritage site'||exploreVal=='heritage'||exploreVal=='site'||exploreVal=='sites'){
        
        return explorer(handlerInput,count);
        
      }
      else{
        
        let doc = require("./choiceAPL.json");
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let regionVar = sessionAttributes.region;
        
        return handlerInput.responseBuilder
            .speak("Wrong choice. Choose again. What would you like to explore in "+ regionVar + " India ?")
            .reprompt('What would you like to explore ?')
            .addDirective({
              type : 'Alexa.Presentation.APL.RenderDocument',
              document : doc,
              datasources : {}
            })
            .getResponse();
          
        
      }
    

        

      
    }
     else if( request.type === 'Alexa.Presentation.APL.UserEvent' ){
      
      let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
      let exploreVal = request.arguments[1];
      let count = 0;
    
      Object.assign(sessionAttributes, {
        intent: "explore",
        region: sessionAttributes.region,
        explore: exploreVal,
        counter: count
      });
      
      console.log('explore_selected :: '+ exploreVal);
      handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
     
      
      return explorer(handlerInput,count);
      
      
      
   
    }
    
    
    
   
  }
  
};

//________________________________________________RegionHandler Intent_________________________________________________

const regionHandler = {
  
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'regionIntent')
        || (handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent' 
        && handlerInput.requestEnvelope.request.arguments[0] === 'regionEvent');
  },
  handle(handlerInput) {
    
    let doc = require("./choiceAPL.json");
    
    const request = handlerInput.requestEnvelope.request;
    
    if( request.type === 'IntentRequest'){
      
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let regionVar = request.intent.slots.regionvar.value;
        
        if(regionVar == 'north east'||regionVar == 'north eastern'){
          regionVar = "northeast";
        }
    
        Object.assign(sessionAttributes, {
          region: regionVar,
          intent: "region"
        });
  
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
  
        console.log('region_selected :: '+ regionVar);
        
        if(regionVar == 'north'||regionVar == 'northern'||regionVar == 'south'||regionVar == 'southern'||regionVar == 'east'||regionVar == 'eastern'||regionVar == 'west'||regionVar == 'western'||regionVar == 'northeast'||regionVar == 'central'||regionVar == 'centre'||regionVar == 'center'){
          
          return handlerInput.responseBuilder
            .speak("What would you like to explore in "+ regionVar + " India ?")
            .reprompt('What would you like to explore ?')
            .addDirective({
              type : 'Alexa.Presentation.APL.RenderDocument',
              document : doc,
              datasources : {}
            })
            .getResponse();
          
        }
        else{
          
          let doc = require('./regionAPL.json');
  
             return handlerInput.responseBuilder
                .speak("Wrong choice. Choose region again.")
                .reprompt('Choose a region')
                .addDirective({
                  type : 'Alexa.Presentation.APL.RenderDocument',
                  document : doc,
                  datasources : {}
                })
                .getResponse();
          
        }
      
    }
    
    else if( request.type === 'Alexa.Presentation.APL.UserEvent' ){
      
      let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
      let regionVar = request.arguments[1];
    
      Object.assign(sessionAttributes, {
          region: regionVar,
          intent: "region"
      });
  
      handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
  
      console.log('region_selected :: '+ regionVar);
      
      return handlerInput.responseBuilder
          .speak("What would you like to explore in "+ regionVar + " India ?")
          .addDirective({
            type : 'Alexa.Presentation.APL.RenderDocument',
            document : doc,
            datasources : {}
          })
          .reprompt('What would you like to explore ?')
          .getResponse();
      
    }

  }
  
};

//__________________________________________________Explore Intent______________________________________________________


const explore = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'explore';
  },
  handle(handlerInput) {
    
    let doc = require("./choiceAPL.json");
    let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    if(!sessionAttributes.region){
        
        let doc = require('./regionAPL.json');
  
      return handlerInput.responseBuilder
        .speak("Choose a region first")
        .reprompt('Choose a region first')
        .addDirective({
          type : 'Alexa.Presentation.APL.RenderDocument',
          document : doc,
          datasources : {}
        })
        .getResponse();
    }
    
    
    let regionVar = sessionAttributes.region;
    
    
    
    console.log('Inside explore recall intent');
    console.log('region_selected :: '+ regionVar);
      
    return handlerInput.responseBuilder
        .speak("What would you like to explore in "+ regionVar + " India ?")
        .addDirective({
          type : 'Alexa.Presentation.APL.RenderDocument',
          document : doc,
          datasources : {}
        })
        .reprompt('What would you like to explore ?')
        .getResponse();

  }
  
};

//___________________________________________________Region Intent______________________________________________________

const region = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'region';
  },
  handle(handlerInput) {
    
    let doc = require('./regionAPL.json');
  
    return handlerInput.responseBuilder
      .speak("Choose a region")
      .reprompt('Choose a region')
      .addDirective({
          type : 'Alexa.Presentation.APL.RenderDocument',
          document : doc,
          datasources : {}
      })
      .getResponse();

  }
};


//________________________________________________Next_Intent and Previous_Intent___________________________________________________

const NextIntent = {
  
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NextIntent';
  },
  handle(handlerInput) {
    
    var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    
    if(!sessionAttributes.region){
        
        let doc = require('./regionAPL.json');
  
      return handlerInput.responseBuilder
        .speak("Choose a region first")
        .reprompt('Choose a region first')
        .addDirective({
          type : 'Alexa.Presentation.APL.RenderDocument',
          document : doc,
          datasources : {}
        })
        .getResponse();
    }
    
    if(!sessionAttributes.explore){
       
      let doc = require("./choiceAPL.json");
    
      let regionVar = sessionAttributes.region;
    
    console.log('Inside explore recall intent');
    console.log('region_selected :: '+ regionVar);
      
    return handlerInput.responseBuilder
        .speak("Choose an explore option first. What would you like to explore in "+ regionVar + " India ?")
        .addDirective({
          type : 'Alexa.Presentation.APL.RenderDocument',
          document : doc,
          datasources : {}
        })
        .reprompt('What would you like to explore ?')
        .getResponse();
    }
    
    let exp = sessionAttributes.explore;
    let popularData;
    
    if(exp=='popular'||exp=='popular destination'||exp=='destination'||exp=='popular destinations'||exp=='destinations'){
      
      popularData = require("./popular.json");
      
    }
    else if(exp=='food'||exp=='cuisine'||exp=='cuisines'||exp=='food and cuisines'||exp=='food and cuisine'){
      
       popularData = require("./food.json");
      
    }
    else if(exp=='heritage'||exp=='heritage site'||exp=='heritage sites'||exp=='site'||exp=='sites'){
      
      popularData = require("./heritage.json");
      
      
    }
    
    
    console.log('length :: '+popularData[sessionAttributes.region].length);
    
    if( sessionAttributes.counter < (popularData[sessionAttributes.region].length -1) ){
      let count = sessionAttributes.counter+1;
      
      Object.assign(sessionAttributes, {
        intent: "next",
        region: sessionAttributes.region,
        explore: sessionAttributes.explore,
        counter: count
      });
      
      handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
      console.log('sessionAttributes :: '+ JSON.stringify(sessionAttributes));
      
      return explorer(handlerInput,count);
    }
    else{
      let count = 0;
      
      Object.assign(sessionAttributes, {
        intent: "next",
        region: sessionAttributes.region,
        explore: sessionAttributes.explore,
        counter: count
      });
      
      handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
      console.log('sessionAttributes :: '+ JSON.stringify(sessionAttributes));
      
      return explorer(handlerInput,count);
      
    }
  
  }
  
};


const PreviousIntent = {
  
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PreviousIntent';
  },
  handle(handlerInput) {
    
    var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    
    if(!sessionAttributes.region){
        
        let doc = require('./regionAPL.json');
  
      return handlerInput.responseBuilder
        .speak("Choose a region first")
        .reprompt('Choose a region first')
        .addDirective({
          type : 'Alexa.Presentation.APL.RenderDocument',
          document : doc,
          datasources : {}
        })
        .getResponse();
      }
      
    if(!sessionAttributes.explore){
       
      let doc = require("./choiceAPL.json");
    
      let regionVar = sessionAttributes.region;
    
    console.log('Inside explore recall intent');
    console.log('region_selected :: '+ regionVar);
      
    return handlerInput.responseBuilder
        .speak("Choose an explore option first. What would you like to explore in "+ regionVar + " India ?")
        .addDirective({
          type : 'Alexa.Presentation.APL.RenderDocument',
          document : doc,
          datasources : {}
        })
        .reprompt('What would you like to explore ?')
        .getResponse();
    }
    
    let exp = sessionAttributes.explore;
    let popularData;
    
    if(exp=='popular'||exp=='popular destination'||exp=='destination'||exp=='popular destinations'||exp=='destinations'){
      
      popularData = require("./popular.json");
      
    }
    else if(exp=='food'||exp=='cuisine'||exp=='cuisines'||exp=='food and cuisines'||exp=='food and cuisine'){
      
       popularData = require("./food.json");
      
    }
    else if(exp=='heritage'||exp=='heritage site'||exp=='heritage sites'||exp=='site'||exp=='sites'){
      
      popularData = require("./heritage.json");
      
      
    }
    
    console.log('length :: '+popularData[sessionAttributes.region].length);
    
    if( sessionAttributes.counter > 0 ){
      let count = sessionAttributes.counter-1;
      
      Object.assign(sessionAttributes, {
        intent: "next",
        region: sessionAttributes.region,
        explore: sessionAttributes.explore,
        counter: count
      });
      
      handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
      console.log('sessionAttributes :: '+ JSON.stringify(sessionAttributes));
      
      return explorer(handlerInput,count);
    }
    else{
      let count = popularData[sessionAttributes.region].length - 1;
      
      Object.assign(sessionAttributes, {
        intent: "next",
        region: sessionAttributes.region,
        explore: sessionAttributes.explore,
        counter: count
      });
      
      handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
      console.log('sessionAttributes :: '+ JSON.stringify(sessionAttributes));
      
      return explorer(handlerInput,count);
      
    }
  
  }
  
};

//________________________________________________________Help Intent__________________________________________________


const HelpIntent = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;

    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    
    Object.assign(sessionAttributes, {
        intent: "help",
        region: sessionAttributes.region,
        explore: sessionAttributes.explore,
        counter: sessionAttributes.counter
      });
      
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    
    return handlerInput.responseBuilder
      .speak(" This skill helps you explore the incredible Indian sub continent in different ways. Say next, to go to next item, say back, to go to previous item, say region, for the region choice, and say explore, for the explore choice. Say cancel or stop to close the skill.  ")
      .reprompt('Shall I start ?')
      .getResponse();

  },
};


//________________________________________________YES Intent_________________________________________________

const YesIntent = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent';
  },
  handle(handlerInput) {
    
    var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    
    if(sessionAttributes){
      
        if(sessionAttributes.intent == "launch"||sessionAttributes.intent == 'help'){
          
            let doc = require('./regionAPL.json');
  
             return handlerInput.responseBuilder
                .speak("Choose a region")
                .reprompt('Choose a region')
                .addDirective({
                  type : 'Alexa.Presentation.APL.RenderDocument',
                  document : doc,
                  datasources : {}
                })
                .getResponse();
          
        
        }
      
    }
   
    return handlerInput.responseBuilder
      .speak("No need to say yes")
      .withSimpleCard('No need to say yes')
      .reprompt('No need to say yes')
      .getResponse();
    
   
  },
};

//________________________________________________Session_ended_Request_________________________________________________

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    console.log("Inside SessionEndedRequestHandler");
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

//_________________________________________________STOP and CANCEL INTENT__________________________________________________


const StopIntent = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent';
  },
  handle(handlerInput) {
    
    const speechOutput = 'Ok Bye, will meet soon';

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withShouldEndSession(true)
      .getResponse();
  },
};

const NoIntent = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent';
  },
  handle(handlerInput) {
    
    const speechOutput = 'Ok Bye, will meet soon';

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withShouldEndSession(true)
      .getResponse();
  },
};

const CancelIntent = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent';
  },
  handle(handlerInput) {
    const speechOutput = 'Ok Bye, will meet soon';

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withShouldEndSession(true)
      .getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};



//_________________________________________________________________________________________________________________________

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    
    LaunchRequest,
    regionHandler,
    ExploreHandler,
    NextIntent,
    PreviousIntent,
    StopIntent,
    CancelIntent,
    NoIntent,
    explore,
    region,
    HelpIntent,
    
    YesIntent,
    SessionEndedRequestHandler
   
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();