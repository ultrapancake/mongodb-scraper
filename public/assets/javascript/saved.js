$(document).ready(function() {
  const articleContainer = $(".article-container");

  $(document).on("click", ".btn.delete", handleArticleDelete);
  $(document).on("click", ".btn.notes", handleArticleNotes);
  $(document).on("click", ".btn.save", handleNoteSave);
  $(document).on("click", ".btn.note-delete", handleNoteDelete);

  initPage();

  function initPage() {
    $.get("/api/headlines?saved=true").then(function(data) {
      articleContainer.empty();

      if (data && data.length) {
        renderArticles(data);
      } else {
        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {
    let articleCards = [];

    for (var i = 0; i < articles.length; i++) {
      articleCards.push(createCard(articles[i]));
    }

    articleContainer.append(articleCards);
  }

  function createCard(article) {
    let card = $(
      [
        "<div class= 'card card-default'>",
        "<div class= 'card-heading'>",
        "<h3>",
        article.headline,
        "<a class='btn btn-danger delete'>",
        "Delete From Saved",
        "</a>",
        "<a class = 'btn btn-info notes'> Article Notes</a>",
        "</h3>",
        "</div>",
        "<div class= 'card-body'>",
        "<img src='",
        article.image,
        "'>",
        "<a class = 'btn btn-info' href='",
        article.url,
        "' target= '_blank'>Link to article</a>",
        "</div>",
        "</div>"
      ].join("")
    );

    card.data("_id", article._id);

    return card;
  }

  function renderEmpty() {
    let emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>There are no saved articles.</h4>",
        "</div>",
        "<div class='card'>",
        "<div class='card-header text-center'>",
        "<h3>Would You Like to Browse Available Articles?</h3>",
        "</div>",
        "<div class='card-body text-center'>",
        "<h4><a href='/'>Browse Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
    articleContainer.append(emptyAlert);
  }

  function renderNotesList(data) {
    let notesToRender = [];
    let currentNote;
    if (!data.notes.length) {
      currentNote = $(
        "<li class='list-group-item'>No notes for this article yet.</li>"
      );
      notesToRender.push(currentNote);
    } else {
      for (var i = 0; i < data.notes.length; i++) {
        currentNote = $("<li class='list-group-item note'>")
          .text(data.notes[i].noteText)
          .append($("<button class='btn btn-danger note-delete'>x</button>"));
        currentNote.children("button").data("_id", data.notes[i]._id);
        notesToRender.push(currentNote);
      }
    }
    $(".note-container").append(notesToRender);
  }

  function handleArticleDelete(event) {
    let articleToDelete = $(this)
      .parents(".card")
      .data();

    $(this)
      .parents(".card")
      .remove();
    console.log(articleToDelete._id);
    $.ajax({
      method: "DELETE",
      url: "/api/headlines/" + articleToDelete._id
    }).then(function(data) {
      if (data) {
        window.load = "/saved";
      }
    });
  }
  function handleArticleNotes() {
    var currentArticle = $(this)
      .parents(".card")
      .data();
    console.log(currentArticle);
    $.get("/api/notes/" + currentArticle._id).then(function(data) {
      console.log(data);
      let modalText = [
        "<div class= 'container-fluid text-center'>",
        "<h4>Notes For Article: ",
        currentArticle._id,
        "</h4>",
        "<hr />",
        "<ul class ='list-group note-container'>",
        "</ul>",
        "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
        "<button class='btn btn-success save'>Save Note</button>",
        "</div>"
      ].join("");
      console.log(modalText);
      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      //Pretty sure this section is what is breaking and giving a 404 error
      let noteData = {
        _id: currentArticle._id,
        notes: data || []
      };
      console.log("noteData:" + JSON.stringify(noteData));
      $(".btn.save").data("article", noteData);
      renderNotesList(noteData);
    });
  }

  function handleNoteSave() {
    let noteData;
    let newNote = $(".bootbox-body textarea")
      .val()
      .trim();
    if (newNote) {
      noteData = {
        _headlineId: $(this).data("article")._id,
        noteText: newNote
      };
      $.post("/api/notes", noteData).then(function() {
        bootbox.hideAll();
      });
    }
  }

  function handleNoteDelete() {
    let noteToDelete = $(this).data("_id");
    $.ajax({
      url: "/api/notes/" + noteToDelete,
      method: "DELETE"
    }).then(function() {
      bootbox.hideAll();
    });
  }
});
