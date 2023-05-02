import { gql } from "apollo-angular";

export const GET_Articles =gql`query{
    allArticles{
      id,
      title,
      description,
      prix
    }
  }`;

export const GET_Search =gql`query($articleFilter:ArticleFilter){
  allArticles(filter:$articleFilter){
    id
    title
    description
    prix
  }
}`;