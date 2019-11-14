// data urls...
var repoGroupUrl = "http://augur.osshealth.io:5000/api/unstable/repo-groups/";
var repoIssueParticipantsUrl = "/issue-participants";
var repoIssueResponseTimeUrl = "/issues-maintainer-response-duration";
var repoIssueMeanCommentsUrl = "/issue-comments-mean";

// used for select elements...
var urlOne, urlTwo, urlThree;
var selectedRepoGroupID;
var selectedRepoGroupName;
var repoObjects = [];
var countedDivs = 0;

function RepoIssue(id, name, participants, mean, average_days){
    this.id = id;
    this.name = name;
    this.participants = participants;
    this.mean = mean;
    this.average_days = average_days;
}

function clearDivs(){
    $('.container').remove();
}

function createDivs(array){
    clearDivs();
    
    for(var i=0;i<array.length;i++){
        $('#testone').append($("<div class=container id=issueDivs><h2>Name: '" + array[i].name + "'</h2><p>ID: '" + array[i].id + "'</p><p>Total number of participants: '" + array[i].participants + "'</p>"));
    }
}

//function calculateMean(url){
//    $.getJSON(url, function(result){
//        var averageMean, count;
//        $(result).each(function(i, repoInfo){
//            var getRepo = repoObjects.findIndex(repo => repo.name === repoInfo.repo_name);
//
//            if(getRepo != -1){
//                count++;
//
//                averageMean = (repoObjects[getRepo] + repoInfo.mean)/count;
//                repoObjects[getRepo].mean += averageMean;
//                alert(repoObjects[getRepo].mean);
//            }
//        });
//    })
//}
    
function loadNames(url){
    if(repoObjects.length > 0){
        repoObjects.length = 0;
    }
    
    $.getJSON(url, function(result){
        $(result).each(function(i, repoInfo){
            var getRepo = repoObjects.findIndex(repo => repo.name === repoInfo.repo_name);

            if(repoObjects.length == 0){
                var newRepoObj = new RepoIssue(repoInfo.repo_id, repoInfo.repo_name, repoInfo.participants);
                repoObjects.push(newRepoObj);
            }
            else if(getRepo == -1){
                var newRepoObj = new RepoIssue(repoInfo.repo_id, repoInfo.repo_name, repoInfo.participants);
                repoObjects.push(newRepoObj);
            }
            else{
                repoObjects[getRepo].participants += repoInfo.participants;
            }
        });
    })
    .done(function(){
        alert("retrieval success");
        createDivs(repoObjects);
        //calculateMean(urlTwo);
    })
}

function showCard(evt, card){
    if($('#testselectone').val() == null){
        $.getJSON(repoGroupUrl, function(result){
            $(result).each(function(i, repoGroup){
                $('#testselectone').append($("<option value='" + repoGroup.repo_group_id + "'>" + repoGroup.rg_name + "</option>"));
            });
        });
    }
    if($('#testselecttwo').val() == null){
        $.getJSON(repoGroupUrl, function(result){
            $(result).each(function(i, repoGroup){
                $('#testselecttwo').append($("<option value='" + repoGroup.repo_group_id + "'>" + repoGroup.rg_name + "</option>"));
            });
        });
    }
    if($('#testselectthree').val() == null){
        $.getJSON(repoGroupUrl, function(result){
            $(result).each(function(i, repoGroup){
                $('#testselectthree').append($("<option value='" + repoGroup.repo_group_id + "'>" + repoGroup.rg_name + "</option>"));
            });
        });
    }
    
    var i, cardlinks, cardcontent;
    cardcontent = document.getElementsByClassName("cardcontent");
    for(i=0;i<cardcontent.length;i++){
        cardcontent[i].style.display = "none";
    }
    cardlinks = document.getElementsByClassName("cardlinks");
    for(i=0;i<cardlinks.length;i++){
        cardlinks[i].className = cardlinks[i].className.replace(" active", "");
    }
    document.getElementById(card).style.display = "block";
    evt.currentTarget.className += " active";
}

$(document).ready(function(){
    // we will need to make several calls for each card to get the information we need
        // we could try making divs for each piece of information for starters
        // if we get time, we could try clicking the card and getting a list of members in each repo
    
    $('.testselectclass').change((function(){
        //alert("change!");
        
        if(document.activeElement.id == "testselectone"){
            selectedRepoGroupID = $("#testselectone option:selected").val();
            selectedRepoGroupName = $("#testselectone option:selected").text();
            urlOne = repoGroupUrl + selectedRepoGroupID + repoIssueParticipantsUrl;
            urlTwo = repoGroupUrl + selectedRepoGroupID + repoIssueResponseTimeUrl;
            urlThree = repoGroupUrl + selectedRepoGroupID + repoIssueMeanCommentsUrl;

            loadNames(urlOne); 
        }
        else if(document.activeElement.id == "testselecttwo"){
            selectedRepoGroupID = $("#testselecttwo option:selected").val();
            selectedRepoGroupName = $("#testselecttwo option:selected").text();
            url = repoGroupUrl + selectedRepoGroupID + repoIssueResponseTimeUrl;
        }
        else if(document.activeElement.id == "testselectthree"){
            selectedRepoGroupID = $("#testselectthree option:selected").val();
            selectedRepoGroupName = $("#testselectthree option:selected").text();
            url = repoGroupUrl + selectedRepoGroupID + repoIssueMeanCommentsUrl;
        }  
    
    }));
});









