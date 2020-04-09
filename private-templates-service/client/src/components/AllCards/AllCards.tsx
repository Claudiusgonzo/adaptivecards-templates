// React
import React, { Component } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
// Store
import { RootState } from "../../store/rootReducer";
import { getAllTags } from "../../store/allTags/actions";
import { AllTagsState } from "../../store/allTags/types";
import { ViewType } from "../../store/viewToggle/types";
import { setViewToggleType } from "../../store/viewToggle/actions";
import { setPage } from "../../store/page/actions";
import { PageState } from "../../store/page/types";
import { addSelectedTag, removeSelectedTag, clearSelectedTags } from "../../store/selectedTags/actions";
import { SelectedTagsState } from "../../store/selectedTags/types";
// Components
import { setSearchBarVisible } from "../../store/search/actions";
import { Title } from "../Dashboard/styled";
import { AllCardsContainer, OuterAllCardsContainer, UpperBar, ViewHelperBar } from "./styled";
import ToggleButton from "./ToggleButton";
import TemplatesView from "./TemplatesView";
import Sort from "../Dashboard/SearchPage/Sort";
import Filter from "../Dashboard/SearchPage/Filter";
import SearchPage from "../Dashboard/SearchPage";
// Utils
import requireAuthentication from "../../utils/requireAuthentication";
// Strings
import { ALL_CARDS_LIST_VIEW, ALL_CARDS_GRID_VIEW, ALL_CARDS, ALL_CARDS_TITLE } from "../../assets/strings";
import TagList from "./TagList";
import { COLORS } from "../../globalStyles";



const mapStateToProps = (state: RootState) => {
  return {
    isSearch: state.search.isSearch,
    tags: state.allTags,
    selectedTags: state.selectedTags,
    page: state.page
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    setPage: (currentPageTitle: string, currentPage: string) => {
      dispatch(setPage(currentPageTitle, currentPage));
    },
    setSearchBarVisible: (isSearchBarVisible: boolean) => {
      dispatch(setSearchBarVisible(isSearchBarVisible));
    },
    toggleView: (viewType: ViewType) => {
      dispatch(setViewToggleType(viewType));
    },
    getAllTags: () => {
      dispatch(getAllTags());
    },
    addSelectedTag: (tag: string) => {
      dispatch(addSelectedTag(tag))
    },
    removeSelectedTag: (tag: string) => {
      dispatch(removeSelectedTag(tag))
    },
    clearSelectedTags: () => {
      dispatch(clearSelectedTags());
    }
  };
};
interface Props extends RouteComponentProps {
  setPage: (currentPageTitle: string, currentPage: string) => void;
  setSearchBarVisible: (isSearchBarVisible: boolean) => void;
  toggleView: (viewType: ViewType) => void;
  getAllTags: () => void;
  addSelectedTag: (tag: string) => void;
  removeSelectedTag: (tag: string) => void;
  clearSelectedTags: () => void;
  isSearch: boolean;
  tags: AllTagsState;
  selectedTags: SelectedTagsState;
  page: PageState;
}

interface State {
  selectedTags: string[];
}
class AllCards extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.props.setPage(ALL_CARDS_TITLE, ALL_CARDS);
    this.props.setSearchBarVisible(true);
    this.setSelectedTags();
  }
  
  setSelectedTags = (): void => {
    if(this.props.page.currentPage === "Template") {
      this.state = { selectedTags: this.props.selectedTags.tags };  
    } else {
      this.props.clearSelectedTags();
      this.state = { selectedTags: [] };
    }
  }

  tagOnClick = (tag: string): void => {
    this.setState((state) => {
      if(state.selectedTags.includes(tag)) {
        this.props.removeSelectedTag(tag);
        return {selectedTags: state.selectedTags.filter((selectedTag: string) => selectedTag !== tag)}
      } else {
        this.props.addSelectedTag(tag);
        return {selectedTags: state.selectedTags.concat(tag)}
      }
    });
  }
  tagToggleStyle = (isSelected: boolean, ref: any) => {
    if(!isSelected) {
      ref.current.style.background = COLORS.BLUE;
      ref.current.style.color = COLORS.WHITE;
    } else {
      ref.current.style.background = COLORS.GREY2;
      ref.current.style.color = COLORS.BLACK;
    }
}
  componentDidMount() { 
    this.props.getAllTags();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.isSearch !== prevProps.isSearch) {
      if (this.props.isSearch) {
        this.props.setPage(ALL_CARDS_TITLE, "searchPage");
      } else {
        this.props.setPage(ALL_CARDS_TITLE, ALL_CARDS);
      }
    }
  }

  selectTemplate = (templateID: string) => {
    this.props.history.push("/preview/" + templateID);
  };

  render() {
    if (this.props.isSearch) {
      return (
        <AllCardsContainer>
          <SearchPage selectTemplate={this.selectTemplate} />
        </AllCardsContainer>
      );
    }
    let tagsState: AllTagsState = this.props.tags;
    let allTags: string[] = [];
    if (!tagsState.isFetching && tagsState.tags && tagsState.tags.allTags) {
      allTags = tagsState.tags?.allTags
    }

    return ( 
      <OuterAllCardsContainer>
        <AllCardsContainer>
          <UpperBar>
            <Title>{ALL_CARDS}</Title>
            <ViewHelperBar>
              <ToggleButton iconProps={{ iconName: "BulletedList" }} onClick={this.props.toggleView} viewType={ViewType.List} title={ALL_CARDS_LIST_VIEW} />
              <ToggleButton iconProps={{ iconName: "GridViewMedium" }} onClick={this.props.toggleView} viewType={ViewType.Grid} title={ALL_CARDS_GRID_VIEW} />
              <Sort />
              <Filter />
            </ViewHelperBar>
          </UpperBar>
          <TagList tags={allTags} selectedTags={this.state.selectedTags} allowEdit={false} onClick={this.tagOnClick} toggleStyle={this.tagToggleStyle}/>
          <TemplatesView onClick={this.selectTemplate} selectedTags={this.state.selectedTags}/>
        </AllCardsContainer>
      </OuterAllCardsContainer>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireAuthentication(withRouter(AllCards)));
