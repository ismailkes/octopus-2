import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable, of } from 'rxjs';
import { Articles } from '../articles';
import { GET_Articles, GET_Search } from '../gql/articles-query';
import { DELETE_Article } from '../gql/articles-mutation';

declare var window:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private apollo:Apollo){ }

  allArticles$:Observable<Articles[]> = of([]);
  searchTitle:string = '';

  deleteModal:any;
  idToDelete:number=0;
  

  ngOnInit():void{

    this.deleteModal = new window.bootstrap.Modal(
      document.getElementById('deleteModal')
    )

    this.allArticles$ = this.apollo.watchQuery<{allArticles:Articles[]}>({query:GET_Articles}).valueChanges.pipe(map((result) => result.data.allArticles));
  }

  search() {
    this.allArticles$ = this.apollo
      .watchQuery<{ allArticles: Articles[] }>({
        query: GET_Search,
        variables: { articleFilter: { title: this.searchTitle } },
      })
      .valueChanges.pipe(map((result) => result.data.allArticles));
  }
  
  openConfirmationModal(id:number){
    this.idToDelete=id;
    this.deleteModal.show();
  }

  delete(){
    this.apollo.mutate<{removeArticle:Articles}>(
      {
        mutation:DELETE_Article,
        variables:{
          id:this.idToDelete,
        },

        update:(store,{data})=>{
          if(data?.removeArticle){
            var allData = store.readQuery<{allArticles:Articles[]}>({query: GET_Articles,});

            if(allData &&allData?.allArticles.length > 0){
              var newData:Articles[]=[...allData.allArticles];
             newData = newData.filter(_ => _.id!==data.removeArticle.id);

              store.writeQuery<{allArticles:Articles[]}>({query: GET_Articles, data:{allArticles:newData}});
            }
          }
        }

      }) .subscribe(({data})=>{ 
            this.deleteModal.hide();
          });
  }

}
