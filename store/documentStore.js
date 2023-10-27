import createStore from "./createStore.js"
import {
  fetchAllDocuments,
  createNewDocument,
  deleteDocumentById
} from "../apis/documents.js"
import { HTTPError } from "../apis/documents.js"
const initialState = { documents: [], newDocument: null, deletedDocument: null }

const reducer = async (state, action) => {
  switch (action.type) {
    case "FETCH":
      try {
        const documents = await fetchAllDocuments()
        return { ...state, documents }
      } catch (err) {
        if (err instanceof HTTPError) {
          err.showAlert(err.status)
        }
        throw err
      }

    case "ADD":
      const newDocument = await createNewDocument(action.payload)
      const updatedDocuments = await fetchAllDocuments()
      return { ...state, documents: updatedDocuments, newDocument }

    case "DELETE":
      const deletedDocument = await deleteDocumentById(action.payload)
      const deletedDocuments = await fetchAllDocuments()
      return { ...state, documents: deletedDocuments, deletedDocument }

    default:
      return { ...state }
  }
}

export const documentStore = new createStore(initialState, reducer)