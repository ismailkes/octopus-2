import { gql } from "apollo-angular";

export const CREATE_Article =gql`mutation ($title: String!, $description: String!, $prix: Int!) {
    createArticle(title:$title, description:$description, prix:$prix) {
      id,
      title,
      description,
      prix
    }
  }`;

  export const UPDATE_Article =gql`mutation ($id:ID!,$title: String!, $description: String!, $prix: Int!) {
    updateArticle(id:$id, title:$title, description:$description, prix:$prix) {
      id,
      title,
      description,
      prix
    }
  }`;

  export const DELETE_Article =gql`mutation($id:ID!){
    removeArticle(id:$id){
      id
    }
  }`;
