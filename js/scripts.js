var tableHands = [];
var dealerHand = [];
var playerHand = [];

var suit = function (){
  var suitName = ["spade", "heart", "diamond", "club"];
  return suitName[Math.floor((Math.random() * 4))];
};

var cardValue = function (){
  return Math.floor((Math.random() * 13)+1);
};

var getCard = function (suit, cardValue) {
  var card = [];
  // card.push(suit(), cardValue());
  card.push(suit, cardValue);
  return card;
};

var getRandomCard = function () {
  var card = [];
  card.push(suit(), cardValue());
  return card;
};


var isExisting= function(tableHands, card) {
  var hasCard = false;
  for(var i= 0; i< tableHands.length; i++){
    var tableCard = tableHands[i];
    if (tableCard[0] === card[0] && tableCard[1]===card[1]){
      hasCard = true;
    }
  }
  return hasCard;
};

var getNewCard = function() {
  var newCard = getRandomCard();
  while(isExisting(tableHands, newCard)){
    newCard = getRandomCard();
  }
  return newCard;
};

var saveCardToHand = function (handArray, card){
  handArray.push(card); // store the card into player's hand
  tableHands.push(card); // store the card to table hand
  return handArray;
};

var getHandValue = function(handArray){
  var valueArray = [];
  for (var i in handArray){
    valueArray.push(handArray[i][1]);
  }
  return valueArray;
};

var isContainAce = function(handArray) {
  var valueArray = getHandValue(handArray);
  var hasAce = false;
  for(var i in valueArray) {
    console.log(valueArray[i]);
    if(valueArray[i] === 1) {
      hasAce = true;
    }
  }
  return hasAce;
};

var calculateValues = function(handArray){
  var valueArray = getHandValue(handArray);
  var totalValue = 0;
  for (var i in valueArray){
    if (valueArray[i] <= 10){
    totalValue += valueArray[i];
    } else if (valueArray[i] > 10){
    totalValue += 10;
    }
  }
  if(totalValue < 21 && isContainAce(handArray)){
    totalValue += 10;
    if (totalValue > 21){
      totalValue -= 10;
    }
  }

  return totalValue;
};

var gameResult = function (playerHand, dealerHand) {
  var result = "";

  var playerTotal = calculateValues(playerHand);
  var dealerTotal = calculateValues(dealerHand);

  if (playerTotal > 21){
    result = "You busted!!";
  } else if (dealerTotal > 21){
    result = "You win!!  Dealer busted.";
  } else {
       if (playerTotal > dealerTotal){
        result = "You win!";
      } else if(dealerTotal > playerTotal){
        result = "Dealer win!";
      } else if (playerTotal === dealerTotal){
        result = "It's a push!";
      }
  }
  return result;
};

var isBlackjack = function(playerHand){
  var isBlackjack = false;
  if (isContainAce(playerHand) && calculateValues(playerHand)===21){
    isBlackjack = true;
  }
  return isBlackjack;
};

var allEmpty = function (){
  tableHands = [];
  dealerHand = [];
  playerHand = [];
};

$(document).ready(function() {

  $("button#hit").hide();
  $("button#stand").hide();

  $("button#deal").click(function() {
    $("button#deal").hide();
    $("button#hit").show();
    $("button#stand").show();

    allEmpty();

    for (var j = 0; j < 2; j++){
      saveCardToHand(dealerHand, getNewCard());
      saveCardToHand(playerHand, getNewCard());
    }

    for (var i in playerHand){
      var idIndex = "playerCard" + i;
      var imgPosition = 100 + i*5;
      var imgSpeed = 800 + i*200;
      $(".player").append("<img id=\'"+ idIndex +"\' src=\'img/"+playerHand[i][1]+"_of_"+playerHand[i][0]+"s.png\' height='140' width='100'>");
      $("img#"+idIndex+"").animate({left:""+imgPosition+"px"}, imgSpeed);
    }

    $(".dealerCard0").append("<img id='dealerCardb' src=\'img/back.png\' height='140' width='100'>");
    $("img#dealerCardb").animate({left:'100px'}, 800);
    $(".dealerCards").append("<img id='dealerCard1' src=\'img/"+dealerHand[1][1]+"_of_"+dealerHand[1][0]+"s.png\' height='140' width='100'>");
    $("img#dealerCard1").animate({left:'105px'}, 1000);

    if(isBlackjack(playerHand)){
      $(".result").append("<font color='blue'>Blackjack! </font><font color='red'> You win!!</font>");
      $("button#hit").hide();
      $("button#stand").hide();
    }

    event.preventDefault();
  });

  $("button#hit").click(function(event) {
    $("button#deal").hide();
    $("button#stand").show();

    saveCardToHand(playerHand, getNewCard());
    var playerHandValue = calculateValues(playerHand);
    if (playerHandValue > 21){
      $(".result").text("You busted!!");
      $("button#hit").hide();
      $("button#stand").hide();
    }

    var j = playerHand.length - 1;
    var idIndex = "playerCard" + j;
    var imgPosition = 100 + j*5;
    $(".player").append("<img id=\'"+ idIndex +"\' src=\'img/"+playerHand[j][1]+"_of_"+playerHand[j][0]+"s.png\' height='140' width='100'>");
    $("img#"+idIndex+"").animate({left:""+imgPosition+"px"}, 800);

    $(".playerTotal").text(" : " + calculateValues(playerHand));
    event.preventDefault();
  });

  $("button#stand").click(function() {
    $("button#deal").hide();
    $("button#hit").hide();

    $(".dealerCard0").empty();

    while(calculateValues(dealerHand) < 17){
      saveCardToHand(dealerHand, getNewCard());
    }

    $(".dealerCard0").append("<img id='dealerCard0' src=\'img/"+dealerHand[0][1]+"_of_"+dealerHand[0][0]+"s.png\' height='140' width='100'>");
    $("img#dealerCard0").animate({left:'100px'}, 0);

    for (var i = 2; i < dealerHand.length; i++){
      var idIndex = "dealerCard" + i;
      var imgPosition = 100 + i*5;
      var imgSpeed = 800 + i*200;
      $(".dealerCards").append("<img id=\'"+ idIndex +"\' src=\'img/"+dealerHand[i][1]+"_of_"+dealerHand[i][0]+"s.png\' height='140' width='100'>");
      $("img#"+idIndex+"").animate({left:""+imgPosition+"px"}, imgSpeed);
    }

    var winner = gameResult(playerHand, dealerHand);

    $(".playerTotal").text(" : " + calculateValues(playerHand));
    $(".dealerTotal").text(" : " + calculateValues(dealerHand));
    $(".result").text(winner);

    event.preventDefault();
  });

  $("button#clear").click(function() {
    $("button#deal").show();

    $("button#hit").hide();
    $("button#stand").hide();

    $(".player").empty();
    $(".playerTotal").empty();
    $(".dealerCard0").empty();
    $(".dealerCards").empty();
    $(".dealerTotal").empty();
    $(".result").empty();
    allEmpty();
  });

}); // end of document
