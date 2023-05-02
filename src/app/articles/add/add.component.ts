import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Articles } from '../articles';
import { CREATE_Article } from '../gql/articles-mutation';
import { GET_Articles } from '../gql/articles-query';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit  {

  constructor(private apollo:Apollo, private router:Router) {}

  articlesForm: Articles={
    id:0,
    title:'',
    description:'',
    prix:0,
  };

  article={
    id:0,
    title:'',
    description:'',
    prix:0,
  };
 
 articleForm!: FormGroup;

  ngOnInit(): void {
    this.articleForm = new FormGroup({
      title: new FormControl(this.article.title, [
        Validators.required,
        Validators.minLength(4)
      ]),

      description: new FormControl(this.article.description, [
        Validators.required,
        Validators.minLength(5)
      ]),

      prix: new FormControl(this.article.prix,Validators.required),
    });
  }
   
  get title() { return this.articleForm.get('title')!; }
  
  get prix() { return this.articleForm.get('prix')!; }

  get description() { return this.articleForm.get('description')!; }

  create(){
    this.apollo.mutate<{createArticle:Articles}>(
      {
        mutation:CREATE_Article,
        variables:{
          title: this.articlesForm.title,
          description: this.articlesForm.description,
          prix: this.articlesForm.prix,
        },

        update:(store,{data})=>{
          if(data?.createArticle){
            var allData = store.readQuery<{allArticles:Articles[]}>({query: GET_Articles,});

            if(allData && allData?.allArticles?.length > 0){
              var newData:Articles[]=[...allData.allArticles];
              newData?.unshift(data.createArticle);

              store.writeQuery<{allArticles:Articles[]}>({query: GET_Articles, data:{allArticles:newData},});
            }
          }
        },

      }) .subscribe(({data})=>{ 
            this.router.navigate(['/']);
          });
  }

test(){
  alert("test");
  console.log(this.article.prix);
}
}
