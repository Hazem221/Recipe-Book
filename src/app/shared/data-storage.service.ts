import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { RecipeService } from "../recipes/recipe.service";

@Injectable({ providedIn: "root" })
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  storeRecipes() {
    // retrieve our list recipes
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        "https://ng-recipe-book-f5b00.firebaseio.com/recipes.json",
        // we need to tell angular what we want to attach to this request
        recipes
      )
      .subscribe(response => {
        console.log(response);
      });
  }
}
