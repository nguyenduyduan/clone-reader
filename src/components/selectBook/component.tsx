import React from "react";
import AddFavorite from "../../utils/readUtils/addFavorite";
import BookModel from "../../model/Book";
import { Trans } from "react-i18next";
import { BookListProps, BookListState } from "./interface";
import { withRouter } from "react-router-dom";
import toast from "react-hot-toast";
import {
  exportBooks,
  exportHighlights,
  exportNotes,
} from "../../utils/syncUtils/exportUtil";
class SelectBook extends React.Component<BookListProps, BookListState> {
  constructor(props: BookListProps) {
    super(props);
    this.state = {
      isOpenDelete: false,
      favoriteBooks: Object.keys(AddFavorite.getAllFavorite()).length,
    };
  }

  render() {
    return (
      <div
        className="booklist-manage-container"
        style={this.props.isCollapsed ? { left: "75px" } : {}}
      >
        <span
          onClick={() => {
            this.props.handleSelectBook(!this.props.isSelectBook);
            if (this.props.isSelectBook) {
              this.props.handleSelectedBooks([]);
            }
          }}
          className="book-manage-title"
        >
          <Trans>{this.props.isSelectBook ? "Cancel" : "Select"}</Trans>
        </span>
        {this.props.isSelectBook && (
          <>
            <span
              className="book-manage-title"
              onClick={() => {
                this.props.handleAddDialog(true);
              }}
            >
              <Trans>Add to Shelf</Trans>
            </span>
            <span
              className="book-manage-title"
              onClick={() => {
                this.props.handleDeleteDialog(true);
              }}
            >
              <Trans>Delete</Trans>
            </span>
            <span
              className="book-manage-title"
              onClick={async () => {
                if (
                  this.props.books.filter(
                    (item: BookModel) =>
                      this.props.selectedBooks.indexOf(item.key) > -1
                  ).length > 0
                ) {
                  await exportBooks(
                    this.props.books.filter(
                      (item: BookModel) =>
                        this.props.selectedBooks.indexOf(item.key) > -1
                    )
                  );
                  toast.success(this.props.t("Export Successfully"));
                } else {
                  toast(this.props.t("Nothing to export"));
                }
              }}
            >
              <Trans>Export Books</Trans>
            </span>
            <span
              className="book-manage-title"
              onClick={async () => {
                let selectedBooks = this.props.books.filter(
                  (item: BookModel) =>
                    this.props.selectedBooks.indexOf(item.key) > -1
                );
                if (
                  this.props.notes.filter(
                    (item) =>
                      selectedBooks.filter(
                        (subitem) => subitem.key === item.bookKey
                      ).length > 0 && item.notes !== ""
                  ).length > 0
                ) {
                  exportNotes(
                    this.props.notes.filter(
                      (item) =>
                        selectedBooks.filter(
                          (subitem) => subitem.key === item.bookKey
                        ).length > 0 && item.notes !== ""
                    ),
                    selectedBooks
                  );
                  toast.success(this.props.t("Export Successfully"));
                } else {
                  toast(this.props.t("Nothing to export"));
                }
              }}
            >
              <Trans>Export Notes</Trans>
            </span>
            <span
              className="book-manage-title"
              onClick={async () => {
                let selectedBooks = this.props.books.filter(
                  (item: BookModel) =>
                    this.props.selectedBooks.indexOf(item.key) > -1
                );
                if (
                  this.props.notes.filter(
                    (item) =>
                      selectedBooks.filter(
                        (subitem) => subitem.key === item.bookKey
                      ).length > 0 && item.notes === ""
                  ).length > 0
                ) {
                  exportHighlights(
                    this.props.notes.filter(
                      (item) =>
                        selectedBooks.filter(
                          (subitem) => subitem.key === item.bookKey
                        ).length > 0 && item.notes === ""
                    ),
                    selectedBooks
                  );
                  toast.success(this.props.t("Export Successfully"));
                } else {
                  toast(this.props.t("Nothing to export"));
                }
              }}
            >
              <Trans>Export Highlights</Trans>
            </span>
            <span
              className="book-manage-title"
              onClick={() => {
                if (
                  this.props.selectedBooks.length === this.props.books.length
                ) {
                  this.props.handleSelectedBooks([]);
                } else {
                  this.props.handleSelectedBooks(
                    this.props.books.map((item) => item.key)
                  );
                }
              }}
            >
              {this.props.selectedBooks.length === this.props.books.length ? (
                <Trans>Deselect All</Trans>
              ) : (
                <Trans>Select All</Trans>
              )}
            </span>{" "}
          </>
        )}
      </div>
    );
  }
}

export default withRouter(SelectBook as any);
