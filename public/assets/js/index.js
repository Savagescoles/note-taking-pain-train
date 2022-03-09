var $noteTaking = $(".note-title");
var $noteData = $(".note-textarea");
var $saveTheNote = $(".save-note");
var $newButton = $(".new-note");
var $noteListing = $(".list-container .list-group");

/*============================================================================
// The current note
==============================================================================*/
var TheNoteRightNow = {};

/*============================================================================
// If there's a note in the database getNotes will get it
==============================================================================*/
var getNotes = function() {
  return $.ajax({
    url: "/api/notes",
    method: "GET"
  });
};

/*============================================================================
// Saving note
==============================================================================*/
var saveNote = function(note) {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST"
  });
};

/*============================================================================
// Deleting a note
==============================================================================*/
var deleteNote = function(id) {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE"
  });
};

var editNote = function(id) {
  return $.ajax({
    url: "api/notes/" + id,
    method: "PUT"
  })
};

var renderActiveNote = function() {
  console.log("got here active note")

  if (TheNoteRightNow.id) {
    $noteTaking.val(TheNoteRightNow.title);
    $noteData.val(TheNoteRightNow.text);
  } else {
    $noteTaking.attr("readonly", false);
    $noteData.attr("readonly", false);
    $noteTaking.val("");
    $noteData.val("");
  }
};
/*============================================================================
// Get data, save it to the db and update 
==============================================================================*/
var handleNoteSave = function() {
  var newNote = {
    title: $noteTaking.val(),
    text: $noteData.val()
  };

  saveNote(newNote).then(function(data) {
    getAlltheNotes();
    renderActiveNote();
  });
};

var handleEdit = function (event) {
  event.stopPropagation();
  handleNoteView();
  console.log("got here")
  var note = $(this)
    .parent(".list-group-item")
    .data();

    if (TheNoteRightNow.id === note.id) {
      TheNoteRightNow = {
        title: $noteTaking.val(),
        text: $noteData.val()
      };
    }
  editNote(note.id).then(function() {
    saveNote(TheNoteRightNow);
    getAlltheNotes();
    renderActiveNote();
  })
    console.log(note)
}

/*============================================================================
// Delete Notes
==============================================================================*/
var handleNoteDelete = function(event) {
  event.stopPropagation();

  var note = $(this)
    .parent(".list-group-item")
    .data();

  if (TheNoteRightNow.id === note.id) {
    TheNoteRightNow = {};
  }

  deleteNote(note.id).then(function() {
    getAlltheNotes();
    renderActiveNote();
  });
};

var handleNoteView = function() {
  console.log("isplaying it")
  TheNoteRightNow = $(this).data();
  renderActiveNote();
};

var handleNewNoteView = function() {
  TheNoteRightNow = {};
  renderActiveNote();
};

var handleRenderSaveBtn = function() {
  if (!$noteTaking.val().trim() || !$noteData.val().trim()) {
    $saveTheNote.hide();
  } else {
    $saveTheNote.show();
  }
};

var renderNoteList = function(notes) {
  $noteListing.empty();

  var noteListItems = [];

  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];

    var $li = $("<li class='list-group-item'>").data(note);
    var $span = $("<span>").text(note.title);
    var $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
    );
    var $editBtn = $(
      "<i class='penStyle fas fa-pen text-light edit-note float-right'>"
    );

    $li.append($span, $delBtn, $editBtn);
    noteListItems.push($li);
  }

  $noteListing.append(noteListItems);
};

var getAlltheNotes = function() {
  return getNotes().then(function(data) {
    renderNoteList(data);
  });
};

$saveTheNote.on("click", handleNoteSave);
$noteListing.on("click", ".edit-note", handleEdit);
$noteListing.on("click", ".list-group-item", handleNoteView);
$newButton.on("click", handleNewNoteView);
$noteListing.on("click", ".delete-note", handleNoteDelete);
$noteTaking.on("keyup", handleRenderSaveBtn);
$noteData.on("keyup", handleRenderSaveBtn);


getAlltheNotes();