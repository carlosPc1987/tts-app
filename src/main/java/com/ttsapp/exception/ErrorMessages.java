package com.ttsapp.exception;

/**
 * Clase centralizada con todos los mensajes de error de la aplicación
 * para facilitar el mantenimiento y la consistencia.
 */
public class ErrorMessages {
    
    // Errores de Registro
    public static final String USERNAME_REQUIRED = "Username is required";
    public static final String USERNAME_SIZE = "Username must be between 3 and 50 characters";
    public static final String USERNAME_ALREADY_EXISTS = "Username '%s' is already taken. Please choose a different username.";
    public static final String EMAIL_REQUIRED = "Email is required";
    public static final String EMAIL_INVALID = "Email must be valid (example: user@domain.com)";
    public static final String EMAIL_ALREADY_EXISTS = "Email '%s' is already registered. If this is your email, try logging in instead.";
    public static final String PASSWORD_REQUIRED = "Password is required";
    public static final String PASSWORD_MIN_LENGTH = "Password must be at least 6 characters long";
    
    // Errores de Login
    public static final String LOGIN_USERNAME_REQUIRED = "Username is required for login";
    public static final String LOGIN_PASSWORD_REQUIRED = "Password is required for login";
    public static final String INVALID_CREDENTIALS = "Invalid username or password. Please check your credentials and try again.";
    public static final String USER_NOT_FOUND = "User not found: %s. Please check your username or register a new account.";
    
    // Errores de TextEntry
    public static final String TITLE_REQUIRED = "Title is required. Please enter a title for your text entry.";
    public static final String TITLE_MAX_LENGTH = "Title must not exceed 200 characters. Please shorten your title.";
    public static final String CONTENT_REQUIRED = "Content is required. Please enter some text to convert to speech.";
    public static final String TEXT_ENTRY_NOT_FOUND = "Text entry not found. It may have been deleted or you don't have permission to access it.";
    public static final String CANNOT_DELETE_OTHERS_TEXT = "You can only delete your own text entries. Contact an administrator if you need to delete another user's text.";
    
    // Errores de TTS
    public static final String TTS_GENERATION_FAILED = "Failed to generate audio. Please check your internet connection and try again.";
    public static final String TTS_EMPTY_RESPONSE = "The text-to-speech service returned an empty response. Please try again with a shorter text.";
    public static final String TTS_SAVE_FAILED = "Failed to save audio file. Please try again or contact support.";
    public static final String TTS_NETWORK_ERROR = "Network error while generating audio. Please check your internet connection.";
    
    // Errores de Autenticación
    public static final String SESSION_EXPIRED = "Your session has expired. Please log in again.";
    public static final String UNAUTHORIZED = "You are not authorized to perform this action.";
    public static final String FORBIDDEN = "Access denied. You don't have permission to access this resource.";
    public static final String TOKEN_INVALID = "Invalid authentication token. Please log in again.";
    
    // Errores de Red
    public static final String NETWORK_ERROR = "Network error. Please check if the server is running and your internet connection.";
    public static final String SERVER_NOT_RESPONDING = "Server is not responding. Please wait a moment and try again, or restart the backend service.";
    
    // Errores Generales
    public static final String INTERNAL_SERVER_ERROR = "An unexpected error occurred. Please try again later or contact support.";
    public static final String VALIDATION_ERROR = "Invalid input data. Please check all fields and try again.";
    public static final String UNKNOWN_ERROR = "An unknown error occurred. Please contact support with the error details.";
    
    // Mensajes de Ayuda
    public static final String HELP_USERNAME = "Username must be 3-50 characters, alphanumeric and underscores allowed.";
    public static final String HELP_EMAIL = "Enter a valid email address (e.g., user@example.com).";
    public static final String HELP_PASSWORD = "Password must be at least 6 characters. Use a mix of letters, numbers, and symbols for better security.";
    public static final String HELP_TITLE = "Enter a descriptive title (max 200 characters) for your text entry.";
    public static final String HELP_CONTENT = "Enter the text you want to convert to speech. The text can be as long as you need.";
    
    private ErrorMessages() {
        // Utility class - no instantiation
    }
}

