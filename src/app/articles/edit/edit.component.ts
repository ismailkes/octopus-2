import { Component, OnInit } from '@angular/core';
import { Articles } from '../articles';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { GET_Search,GET_Articles } from '../gql/articles-query';
import { UPDATE_Article } from '../gql/articles-mutation';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  constructor(private apollo:Apollo, private route:ActivatedRoute, private router: Router){}

  
  articlesForm:Articles={
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
    this.route.paramMap.subscribe((params)=>{
      var id=Number(params.get('id'));
      this.getByid(id);
    });
    this.articleForm = new FormGroup({
      title: new FormControl(this.article.title, [
        Validators.required
      ]),
  
      description: new FormControl(this.article.description, [
        Validators.required
      ]),
  
      prix: new FormControl(this.article.prix,Validators.required),
    });
  }
  
  get title() { return this.articleForm.get('title')!; }
  
  get prix() { return this.articleForm.get('prix')!; }

  get description() { return this.articleForm.get('description')!; }





  getByid(id:number){
     this.apollo.watchQuery<{allArticles:Articles[]}>({
      query:GET_Search,
      variables:{articleFilter:{id}},
     })
     .valueChanges.subscribe(({data})=>{
      var articlesById=data.allArticles[0];
      this.articlesForm={
        id: articlesById.id,
        title: articlesById.title,
        description: articlesById.description,
        prix: articlesById.prix,
      };
     });
  }

  update(){
    this.apollo.mutate<{updateArticle:Articles}>(
    {
      mutation:UPDATE_Article,
      variables:{
        id:this.articlesForm.id,
        title:this.articlesForm.title,
        description:this.articlesForm.description,
        prix:this.articlesForm.prix,
      },

      update:(store,{data})=>{
        if(data?.updateArticle){
          var allData = store.readQuery<{allArticles:Articles[]}>({query: GET_Articles,});

          if(allData && allData?.allArticles?.length > 0){
            var newData:Articles[]=[...allData.allArticles];
            newData = newData.filter((_)=>_.id !== data.updateArticle.id);
            newData.unshift(data.updateArticle);

            store.writeQuery<{allArticles:Articles[]}>({query: GET_Articles, data:{allArticles:newData},});
          }
        }
      },

    }) .subscribe(({data})=>{ 
          this.router.navigate(['/']);  
        });
}
}
