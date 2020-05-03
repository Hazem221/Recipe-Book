import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError } from "rxjs/operators";
// throwError => create new opservable that wraps an error
import { throwError } from "rxjs";

// why i define interface ?
// it's a good practice in angular and typescript to define types of data you working with
export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean; // ? to indicate this is optional
}

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(private http: HttpClient) {}

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBUVRVWgembS4lo99eZORE53d25YFKTyoM",
        {
          // first email (key) word is for firebase authentication : second email (value) word is for arguments in sign up method
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(catchError(this.handleError));
    // handleError refers to (private method in the bottom of this service)
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBUVRVWgembS4lo99eZORE53d25YFKTyoM",
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(catchError(this.handleError));
  }

  // ********* to share error handling logic between both obersvables (sign up / login)

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = "An Unknown Error Occured";

    // switch statement will fail if the error we are getting doesn't have the same format
    // so i will use if statment to check if the error response doesn't have error (maybe it has network error)
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
    }
    switch (errorResponse.error.error.message) {
      case "EMAIL_EXISTS":
        errorMessage = "This Email Exists Already";
        break;
      case "EMAIL_NOT_FOUND":
        errorMessage = "This Email Doesn't Exists";
        break;
      case "INVALID_PASSWORD":
        errorMessage = "This Password Doesn't Exists";
        break;
    }
    return throwError(errorMessage);
  }
}
