from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token

from . import views

urlpatterns = [
    path("", views.Index.as_view(), name="index"),
    
    path("get_csrf_token", views.GetCSRFToken.as_view(), name="csrftoken"),
    
    path("is_active", views.IsActive.as_view(), name="isactive"),
    path("login", obtain_auth_token, name="login"),
    path("register", views.Register.as_view(), name="register"),
    path("get_user", views.GetUser.as_view(), name="user"),
    path("logout", views.Logout.as_view(), name="logout"),
    path("activate/<uidb64>/<token>", views.Activate.as_view(), name="activate"),
    
    path("update_user", views.UpdateProfileInfo.as_view(), name="update_user"),
    path("change_password", views.ChangePassword.as_view(), name="change_password"),
    path("password_reset_query", views.PasswordResetSender.as_view(), name="password_reset_query"),
    path("password_reset", views.ResetPassword.as_view(), name="password_reset"),
    
    path("create_course", views.CreateCourse.as_view(), name="create_course"),
    path("get_courses", views.GetUserCourses.as_view(), name="courses"),
    path("delete_course", views.DeleteCourse.as_view(), name="delete_course"),
    path("rename_course", views.RenameCourse.as_view(), name="rename_course"),
    
    path("create_deck", views.CreateDeck.as_view(), name="create_deck"),
    path("course_decks", views.GetCourseDecks.as_view(), name="course_decks"),
    path("user_decks", views.GetUserDecks.as_view(), name="all_user_decks"),
    path("fetch_deck", views.GetDeck.as_view(), name="fetch_deck"),
    path("delete_deck", views.DeleteDeck.as_view(), name="delete_deck"),
    path("rename_deck", views.RenameDeck.as_view(), name="rename_deck"),
    path("export_deck", views.DeckToCsv.as_view(), name="export_deck"),
    path("reset_confidences", views.ResetDeckConfidence.as_view(), name="reset_deck_confidence"),
    
    path("create_card", views.CreateCard.as_view(), name="create_card"),
    path("fetch_deck_card", views.GetCard.as_view(), name="fetch_card"),
    path("update_card", views.UpdateCard.as_view(), name="update_card"),
    path("update_confidence", views.UpdateCardConfidence.as_view(), name="update_confidence"),
    path("delete_card", views.DeleteCard.as_view(), name="delete_card"),
    path("upload_cards_csv", views.ImportCardsFromCsv.as_view(), name="upload_cards_csv"),
    
]