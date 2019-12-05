// data urls...
var repoGroupUrl = "http://augur.osshealth.io:5000/api/unstable/repo-groups/";
var repoIssueParticipantsUrl = "/issue-participants";
var repoIssueResponseTimeUrl = "/issues-maintainer-response-duration";
var repoIssueMeanCommentsUrl = "/issue-comments-mean";

// used for select elements...
var selectedRepoGroupID;
var selectedRepoGroupName;
var repoObjects = [];
var selectVars = [2];
var urls = [3];

var averageMean, counter = null;

var loadedGroups = false;

function RepoIssue(id, name, participants, mean, averageDays, count){
    this.id = id;
    this.name = name;
    this.participants = participants;
    this.mean = mean;
    this.averageDays = averageDays;
    this.count = count;
}

function createRepo(url){

    if(repoObjects.length > 0){
        repoObjects.length = 0;
    }

    try{
        $('#loadingSpinner').show();
        $.getJSON(url, function(result){
            $(result).each(function(i, repoInfo){
                var getRepo = repoObjects.findIndex(repo => repo.name === repoInfo.repo_name);

                if(repoObjects.length == 0){
                    var newRepoObj = new RepoIssue(repoInfo.repo_id, repoInfo.repo_name, repoInfo.participants, null, null, null);
                    repoObjects.push(newRepoObj);
                }
                else if(getRepo == -1){
                    var newRepoObj = new RepoIssue(repoInfo.repo_id, repoInfo.repo_name, repoInfo.participants, null, null, null);
                    repoObjects.push(newRepoObj);
                }
                else{
                    repoObjects[getRepo].participants += repoInfo.participants;
                }
            });
            $('#loadingSpinner').hide();
        })
        .done(function(){
            calculateMean(urls[2]);
        })
    }
    catch(e){
        console.error(e.name);
        console.error(e.message);
    }
    finally{
        counter = null;
    }
}

function calculateMean(url){

    if(averageMean != null || counter != null){
        averageMean = null;
        counter = null;
    }

    try{
        $('#loadingSpinner').show();
        $.getJSON(url, function(result){
            $(result).each(function(i, repoInfo){

                // get index of repo
                var getRepo = repoObjects.findIndex(repo => repo.id == repoInfo.repo_id);

                if(getRepo == -1){
                    // repo is not present and we need to create one
                    alert("repo is not present in array");
                    createRepo(urls[0]);

                    // now that we have created the repo, we need to grab the index of the new repo so we can add the mean value
                    var getRepoAgain = repoObjects.findIndex(repo => repo.id == repoInfo.repo_id);
                    alert("the newly created repo is: " + repoObjects[getRepoAgain].name);
                    repoObjects[getRepoAgain].mean = repoInfo.mean;
                    repoObjects[getRepoAgain].count += 1;
                    alert("the new repo " + repoObjects[getRepoAgain].name + " has a mean value of " + repoObjects[getRepoAgain].mean + " and counter value of " + repoObjects[getRepoAgain].count);
                    counter += 1;
                }
                else if(repoObjects[getRepo].mean == null){
                    // we want to add the value because the mean has not been altered yet
                    repoObjects[getRepo].mean = repoInfo.mean;
                    repoObjects[getRepo].count += 1;

                    counter += 1;
                }
                else if(repoObjects[getRepo].mean != null){
                    // first we want to bump the counter so we can properly calculate the average
                    repoObjects[getRepo].count += 1;

                    //second we need to get the average of the existing mean value and the new mean from the api call
                    averageMean = (repoObjects[getRepo].mean + repoInfo.mean)/repoObjects[getRepo].count;

                    // lastly, we replace the old average with the new average
                    repoObjects[getRepo].mean = averageMean;

                    counter += 1;
                }
            });
            $('#loadingSpinner').hide();
        })
        .done(function(){
            counter = null;
            averageMean = null;
            calculateAvgDaysPerComment(urls[1]);
        })
    }
    catch(e){
        console.error(e.name);
        console.error(e.message);
    }
    finally{
        averageMean = null;
        counter = null;
    }
}

function calculateAvgDaysPerComment(url){

    // check if the averageDays and count variables are already full so we can start new
    if(counter != null){
        counter = null;
    }

    try{
        // make api call
        $('#loadingSpinner').show();
        $.getJSON(url, function(result){
            $(result).each(function(i, repoInfo){
                // get index of current repo id to see if it exists in our array
                var getRepo = repoObjects.findIndex(repo => repo.id == repoInfo.repo_id);

                if(repoObjects.length == 0){
                    // if there are no repos present we need to create one
                    alert("no repos present");
                    createRepo(urls[0]);

                    // now we need to get the new index for this repo object and modify its elements
                    var getRepoAgain = repoObjects.findIndex(repo => repo.id == repoInfo.repo_id);

                    alert("the index of the newly created repo " + repoObjects[getRepoAgain].name + " is " + getRepoAgain);
                    // add the average mean for the repo
                    calculateMean(urls[2]);
                    alert("the average mean for " + repoObjects[getRepoAgain].name + " is " + repoObjects[getRepoAgain].mean);
                    // modify the average days per issue for the selected object
                    repoObjects[getRepoAgain].averageDays = repoInfo.average_days_comment;
                    alert("the average days per issue resolution for " + repoObjects[getRepoAgain].name + " is " + repoObjects[getRepoAgain].averageDays);
                    counter += 1;
                }
                else if(getRepo == -1){ // if the repo does not exist, lets create a new one
                    alert("repo does not exist");
                    createRepo(urls[0]);

                    // double check to make sure the repo was added
                    var getRepoAgain = repoObjects.findIndex(repo => repo.id == repoInfo.repo_id);
                    while(getRepoAgain == -1){
                        getRepoAgain = repoObjects.findIndex(repo => repo.id == repoInfo.repo_id);
                    }
                    alert("the index of the new repo " + repoObjects[getRepoAgain].name + " has index " + getRepoAgain);

                    // now we need to add the mean to the new repo
                    calculateMean(urls[2]);
                    alert("the mean for repo " + repoObjects[getRepoAgain].name + " is " + repoObjects[getRepoAgain].mean);

                    // finally, lets add the avg. days per comment value
                    repoObjects[getRepoAgain].averageDays = repoInfo.average_days_comment;
                    alert("the initial avg. days per comment for " + repoObjects[getRepoAgain].name + " is " + repoObjects[getRepoAgain].averageDays);
                    counter += 1;
                }
                else { // if the repo exists...
                    repoObjects[getRepo].averageDays = repoInfo.average_days_comment;

                    counter += 1;
                }
            });
            $('#loadingSpinner').hide();
        })
        .done(function(){
            counter = null;
            createDivs(repoObjects);
        })
    }
    catch(e){
        console.error(e.name);
        console.error(e.message);

    }
    finally{
        counter = null;
    }
}

function createDivs(array){

    try{
        $('.container').remove();

        for(var i=0;i<array.length;i++){
          $('#repolist').append($("<li><a href='#'><div class=container id=issueDivs><h2 id=headerid>" + array[i].name + "</h2><p>ID: " + array[i].id + "</p><p>Total number of participants: " + array[i].participants + "</p><p>Mean amount of comments per issue: " + array[i].mean + " comments</p><p>Average response time for issues to be solved: " + array[i].averageDays + " days</p></div></a></li><br>"));
        }
    }
    catch(e){
        console.error(e.name);
        console.error(e.message);
    }
}

function generateColor(){
  var color = '#' + (Math.random()*0xFFFFFF<<0).toString(16);
  return color;
}

function showCard(evt, card){

    try{
        if($('#testselectone').val() == null || loadedGroups == false){
          $('#loadingSpinner').show();
          $.getJSON(repoGroupUrl, function(result){
              $(result).each(function(i, repoGroup){
                  $('#testselectone').append($("<option value='" + repoGroup.repo_group_id + "'>" + repoGroup.rg_name + "</option>"));
                  loadedGroups = true;
              });
              $('#loadingSpinner').hide();
          });
        }
        // if($('#testselecttwo').val() == null){
        //     $.getJSON(repoGroupUrl, function(result){
        //         $(result).each(function(i, repoGroup){
        //             $('#testselecttwo').append($("<option value='" + repoGroup.repo_group_id + "'>" + repoGroup.rg_name + "</option>"));
        //         });
        //     });
        // }
        // if($('#testselectthree').val() == null){
        //     $.getJSON(repoGroupUrl, function(result){
        //         $(result).each(function(i, repoGroup){
        //             $('#testselectthree').append($("<option value='" + repoGroup.repo_group_id + "'>" + repoGroup.rg_name + "</option>"));
        //         });
        //     });
        // }
    }
    catch(e){
        console.error(e.name);
        console.error(e.message);
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

function getSelectVars(elementID){
    if(elementID == "null"){
        selectVars[0] = null;
        selectVars[1] = null;
    }
    else{
        selectVars[0] = $(elementID).val();
        selectVars[1] = $(elementID).text();
    }
}

function getUrls(repoGroup){
    if(repoGroup == "null"){
        urls[0] = null;
        urls[1] = null;
        urls[2] = null;
    }
    else{
        urls[0] = repoGroupUrl + selectVars[0] + repoIssueParticipantsUrl;
        urls[1] = repoGroupUrl + selectVars[0] + repoIssueResponseTimeUrl;
        urls[2] = repoGroupUrl + selectVars[0] + repoIssueMeanCommentsUrl;
    }
}

function filterList(){
  var tag, textValue, searchText, convert, list, listArray;

  // get text from input
  searchText = $('#searchRepoID').val();
  convert = searchText.toUpperCase();
  list = $('#repolist');
  // make an array of list items to search
  listArray = list.find('li');

  for(var i=0;i<listArray.length;i++){
    tag = listArray[i].getElementsByTagName("h2").item(0);
    textValue = tag.innerHTML;

    if(textValue.toUpperCase().indexOf(convert) > -1){
      listArray[i].style.display = "";
    }
    else {
      listArray[i].style.display = "none";
    }
   }
}

$(document).ready(function(){

  try{
    $('#loadingSpinner').hide();

    $('.testselectclass').change((function(){
      if($('#repolist') != null){
        $('#repolist').remove();
      }
      $('#testone').append($("<ul id=repolist></ul>"));

      if(document.activeElement.id == "testselectone"){
        if($('#testselectone').val() != "Nothing selected"){

          getSelectVars("#testselectone");
          getUrls(selectVars[0]);

          createRepo(urls[0]);
        }
      }
      // else if(document.activeElement.id == "testselecttwo"){
      //   selectedRepoGroupID = $("#testselecttwo option:selected").val();
      //   selectedRepoGroupName = $("#testselecttwo option:selected").text();
      //   url = repoGroupUrl + selectedRepoGroupID + repoIssueResponseTimeUrl;
      // }
      // else if(document.activeElement.id == "testselectthree"){
      //   selectedRepoGroupID = $("#testselectthree option:selected").val();
      //   selectedRepoGroupName = $("#testselectthree option:selected").text();
      //   url = repoGroupUrl + selectedRepoGroupID + repoIssueMeanCommentsUrl;
      // }

    }));

  }
  catch(e){
    console.error(e.name);
    console.error(e.message);
  }
});
