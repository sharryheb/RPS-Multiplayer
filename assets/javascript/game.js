
var player1 =
{
    name: "",
    gesture: "",
    ready: false,
    wins: 0,
    losses: 0,
    ties: 0
};

var player2 =
{
    name: "",
    gesture: "",
    ready: false,
    wins: 0,
    losses: 0,
    ties: 0
};

var whoAmI = 0;
var winner = -1;

var firebaseConfig = {
    apiKey: "AIzaSyAGhD4QItcZQ1qI-VlmshIL3LpGyHv7D7s",
    authDomain: "bcs-homework.firebaseapp.com",
    databaseURL: "https://bcs-homework.firebaseio.com",
    projectId: "bcs-homework",
    storageBucket: "",
    messagingSenderId: "982134395150",
    appId: "1:982134395150:web:b6908321d22496c4"
    };
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

database.ref().on("value", UpdatePlayer);
database.ref().on("child_removed", DeletePlayer);

$(document).keyup(function(event)
{
    if (event.keyCode === 13)
        $("#NameInput").click();
});

$( document ).ready(function() {
  $( "#PlayerName" ).focus();
});


$("#NameInput").click(function()
{
    var pendingPlayer = $("#PlayerName").val().trim();

    if (!player1.name)
    {
        whoAmI = 1;
        database.ref().child("p1/name").set(pendingPlayer);
        database.ref("p1").onDisconnect().remove();
        $("#P1Choices").removeClass("d-none");
        $("#P1Name").removeClass("d-none");
        $("#P1Name").text(" Player 1: " + pendingPlayer);

    }

    else if (!player2.name)
    {
        whoAmI = 2;
        database.ref().child("p2/name").set(pendingPlayer);
        database.ref("p2").onDisconnect().remove();
        $("#P2Choices").removeClass("d-none");
        $("#P2Name").removeClass("d-none");
        $("#P2Name").text("Player 2: " + pendingPlayer);
    }

    else $("message").text("There are already 2 players!");

    $("#PlayerJoinForm").addClass("d-none");
});

$(".gesture").click(function()
{
    var elementId = $(this).attr("id");
    var pendingGesture = elementId.substring(0, elementId.indexOf("P"));

    if (elementId.indexOf("P1") > -1)
    {
        database.ref().child("p1/gesture").set(pendingGesture);
        database.ref().child("p1/ready").set(true);
        $("#P1ChoiceImage").attr("src", "assets/images/" + pendingGesture + ".png");
    }
    else
    {
        database.ref().child("p2/gesture").set(pendingGesture);
        database.ref().child("p2/ready").set(true);
        $("#P2ChoiceImage").attr("src", "assets/images/" + pendingGesture + ".png");
    }
});

$("#AgainYes").click(function()
{
    var thisPlayer = whoAmI === 1 ? player1 : player2;
    thisPlayer.gesture = "";
    thisPlayer.ready = false;

    database.ref().child("p" + whoAmI + "/gesture").set(false);
    database.ref().child("p" + whoAmI + "/ready").set(false);

    $("#message-left").text("");
    $("#message").text("");
    $("#message-right").text("");
    $("#message-left").removeClass("bg-success text-white");
    $("#message").removeClass("bg-success text-white");
    $("#message-right").removeClass("bg-success text-white");

    $("#P1Choice").addClass("d-none");
    $("#P1ChoiceImage").attr("src", "");

    $("#P2Choice").addClass("d-none");
    $("#P2ChoiceImage").attr("src", "");

    if (whoAmI == 1)
        $("#P1Choices").removeClass("d-none");

    if (whoAmI == 2)
        $("#P2Choices").removeClass("d-none");

    $("#PlayAgainForm").addClass("d-none");

    $("#message").text("");
    winner = -1;

    AllReady();
});


$("#AgainNo").click(function()
{
    $("#message-left").text("");
    $("#message").text("");
    $("#message-right").text("");
    $("#message-left").removeClass("bg-success text-white");
    $("#message").removeClass("bg-success text-white");
    $("#message-right").removeClass("bg-success text-white");

    $("#P1Choice").addClass("d-none");
    $("#P1ChoiceImage").attr("src", "");
    $("#P1Choices").addClass("d-none");

    $("#P2Choice").addClass("d-none");
    $("#P2ChoiceImage").attr("src", "");
    $("#P2Choices").addClass("d-none");

    $("#PlayAgainForm").addClass("d-none");
    $("#PlayerJoinForm").removeClass("d-none");

    database.ref("p" + whoAmI).remove();

});


function DeletePlayer(snapshot)
{
    if (snapshot.key == "p1")
    {
        player1.name = "";
        player1.gesture = "";
        player1.ready = false;
        player1.wins = 0;
        player1.losses = 0;
        player1.ties = 0;

        $("#P1Name").text("");
        $("#P1Choice").addClass("d-none");
        $("#P1ChoiceImage").attr("src", "");
        $("#P1Choices").addClass("d-none");

        if (whoAmI == 1)
        {
            $("#PlayerName").val("");
            $("#PlayerJoinForm").removeClass("d-none");
        }
    }

    if (snapshot.key == "p2")
    {
        player2.name = "";
        player2.gesture = "";
        player2.ready = false;
        player2.wins = 0;
        player2.losses = 0;
        player2.ties = 0;

        $("#P2Name").text("");
        $("#P2Choice").addClass("d-none");
        $("#P2ChoiceImage").attr("src", "");
        $("#P2Choices").addClass("d-none");

        if (whoAmI == 2)
        {
            $("#PlayerName").val("");
            $("#PlayerJoinForm").removeClass("d-none");
        }
    }

    winner = -1;

    AllReady();
}

function UpdatePlayer (snapshot)
{
    if (snapshot.child("p1"))
    {
        if(snapshot.child("p1/name").exists())
        {
            player1.name = snapshot.child("p1/name").val();
        }

        if(snapshot.child("p1/gesture").val())
        {
            player1.gesture = snapshot.child("p1/gesture").val();
            $("#P1Choices").addClass("d-none");
            if (whoAmI == 1)
            {
                $("#P1ChoiceImage").attr("src", "assets/images/" + player1.gesture + ".png");
                $("#P1Choice").removeClass("d-none");
            }
        }

        if(snapshot.child("p1/wins").val())
        {
            player1.wins = snapshot.child("p1/wins").val();
            $("#P1Wins").text(player1.wins);
        }
        if(snapshot.child("p1/losses").val())
        {
            player1.losses = snapshot.child("p1/losses").val();
            $("#P1Losses").text(player1.losses);
        }
        if(snapshot.child("p1/ties").val())
        {
            player1.ties = snapshot.child("p1/ties").val();
            $("#P1Ties").text(player1.ties);
        }

        player1.ready = snapshot.child("p1/ready").val();
    }

    if (snapshot.child("p2"))
    {
        if(snapshot.child("p2/name").val())
        {
            player2.name = snapshot.child("p2/name").val();
        }

        if(snapshot.child("p2/gesture").val())
        {
            player2.gesture = snapshot.child("p2/gesture").val();
            $("#P2Choices").addClass("d-none");
            if (whoAmI == 2)
            {
                $("#P2ChoiceImage").attr("src", "assets/images/" + player2.gesture + ".png");
                $("#P2Choice").removeClass("d-none");
            }
        }

        if(snapshot.child("p2/wins").val())
        {
            player2.wins = snapshot.child("p2/wins").val();
            $("#P2Wins").text(player2.wins);
        }
        if(snapshot.child("p2/losses").val())
        {
            player2.losses = snapshot.child("p2/losses").val();
            $("#P2Losses").text(player2.losses);
        }
        if(snapshot.child("p2/ties").val())
        {
            player2.ties = snapshot.child("p2/ties").val();
            $("#P2Ties").text(player2.ties);
        }

        player2.ready = snapshot.child("p2/ready").val();
    }

    if (winner < 0)
    {
        AllReady();
    }
    else
    {
        $("#PlayAgainForm").removeClass("d-none");
    }
  }

function AllReady()
{
    var notReady = "";
    var p1Name = "Player 1";
    var p2Name = "Player 2";
    var toChoose = " to choose ";
    var toJoin = " to join ";
    var p1NamePhrase = "";
    var p2NamePhrase = "";

    if (player1.ready && player2.ready)
    {
        $("#P1ChoiceImage").attr("src", "assets/images/" + player1.gesture + ".png");
        $("#P1Choice").removeClass("d-none");
        $("#P2ChoiceImage").attr("src", "assets/images/" + player2.gesture + ".png");
        $("#P2Choice").removeClass("d-none");
        $("#message-left").text("");
        $("#message").text("");
        $("#message-right").text("");

        winner = FindWinner(player1.gesture, player2.gesture);
        if (winner == 0)
        {
            $("#message").addClass("bg-success text-white");
            $("#message").text("IT'S A TIE!!");
            player1.ties++;
            player2.ties++;
            database.ref().child("p1/ties").set(player1.ties);
            database.ref().child("p2/ties").set(player2.ties);
        }
        else if (winner == 1)
        {
            $("#message-left").addClass("bg-success text-white");
            $("#message-left").text(player1.name.toUpperCase() + " IS THE WINNER!!");
            player1.wins++;
            player2.losses++;
            database.ref().child("p1/wins").set(player1.wins);
            database.ref().child("p2/losses").set(player2.losses);
        }
        else if (winner == 2)
        {
            $("#message-right").addClass("bg-success text-white");
            $("#message-right").text(player2.name.toUpperCase() + " IS THE WINNER!!");
            player1.losses++;
            player2.wins++;
            database.ref().child("p1/losses").set(player1.losses);
            database.ref().child("p2/wins").set(player2.wins);
        }
        database.ref().child("p1/ready").set(false);
        database.ref().child("p2/ready").set(false);
    }
    else
    {
        if(player1.name != "")
        {
            p1Name = player1.name;
            if (!player1.ready)
                p1NamePhrase = p1Name + toChoose;
        }
        else
        {
            p1NamePhrase = p1Name + toJoin;
        }

        if(player2.name != "")
        {
            p2Name = player2.name;
            if (!player2.ready)
                p2NamePhrase = p2Name + toChoose;
        }
        else
        {
            p2NamePhrase = p2Name + toJoin;
        }

        if (p1Name == player1.name)
            $("#P1Name").text("Player 1: " + p1Name);
        else
            $("#P1Name").text(p1Name);

        if (p2Name == player2.name)
            $("#P2Name").text("Player 2: " + p2Name);
        else
            $("#P2Name").text(p2Name);

        if (p1NamePhrase != "" || p2NamePhrase != "")
        {
            var useAnd =  "";
            if (p1NamePhrase != "" && p2NamePhrase != "")
                useAnd =  " and ";

            notReady = "Waiting for " + p1NamePhrase + useAnd + p2NamePhrase;
            notReady = RemoveFirstOccurrence(notReady, "to join");
            notReady = RemoveFirstOccurrence(notReady, "to choose");
            $("#message").text(notReady);
        }
    }
}

function RemoveFirstOccurrence(str, delimiter)
{
    var idx1 = str.indexOf(delimiter);
    var idx2 = str.lastIndexOf(delimiter);
    if (idx1 != idx2)
        str = str.slice(0, idx1-1) + str.slice(idx1 + delimiter.length, str.length);
    return str;
}

function FindWinner(p1Gesture, p2Gesture)
{
    var winner = -1;
    if (p1Gesture == "rock")
    {
        if (p2Gesture == "rock") winner = 0;
        if (p2Gesture == "paper") winner = 2;
        if (p2Gesture == "scissors") winner = 1;
        if (p2Gesture == "lizard") winner = 1;
        if (p2Gesture == "spock") winner = 2;
    }

    if (p1Gesture == "paper")
    {
        if (p2Gesture == "rock") winner = 1;
        if (p2Gesture == "paper") winner = 0;
        if (p2Gesture == "scissors") winner = 2;
        if (p2Gesture == "lizard") winner = 2;
        if (p2Gesture == "spock") winner = 1;
    }

    if (p1Gesture == "scissors")
    {
        if (p2Gesture == "rock") winner = 2;
        if (p2Gesture == "paper") winner = 1;
        if (p2Gesture == "scissors") winner = 0;
        if (p2Gesture == "lizard") winner = 1;
        if (p2Gesture == "spock") winner = 2;
    }

    if (p1Gesture == "lizard")
    {
        if (p2Gesture == "rock") winner = 2;
        if (p2Gesture == "paper") winner = 1;
        if (p2Gesture == "scissors") winner = 2;
        if (p2Gesture == "lizard") winner = 0;
        if (p2Gesture == "spock") winner = 1;
    }

    if (p1Gesture == "spock")
    {
        if (p2Gesture == "rock") winner = 1;
        if (p2Gesture == "paper") winner = 2;
        if (p2Gesture == "scissors") winner = 1;
        if (p2Gesture == "lizard") winner = 2;
        if (p2Gesture == "spock") winner = 0;
    }

    return winner;
}
