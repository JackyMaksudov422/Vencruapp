import React from 'react';
import propTypes from 'prop-types';
import Dropdown from './Dropdown';
import ButtonGroup from './ButtonGroup';

export default class TableControls extends React.PureComponent {

    static propTypes = {
        onSearchChange: propTypes.func,
        totalRecord: propTypes.number,
        currentPage: propTypes.number,
        actions: propTypes.array,
        filterOptions: propTypes.array,
        sortOptions: propTypes.array,
        onDeletePress: propTypes.func,
        pagination: propTypes.object,
        onActionChange: propTypes.func,
        onSortChange: propTypes.func,
        onFilterChange: propTypes.func,
        onPaginationNav: propTypes.func,
        leftActions: propTypes.array,
        onSelectActionsTop: propTypes.array,
        onSelectActionsBottom: propTypes.array,
        selectedItems: propTypes.array
    }

    static defaultProps = {
        totalRecord: 0,
        currentPage: 0
    }

    state = {
        search: ''
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.search !== this.state.search){
            if(this.searchDebounce){
                clearTimeout(this.searchDebounce);
            }
            this.searchDebounce = setTimeout(() => {
                if(typeof this.props.onSearchChange == 'function'){
                    this.props.onSearchChange(this.state.search);
                }
            }, 800);
        }
    }

    render() {
        const { 
            actions, 
            totalRecord, 
            currentPage, 
            filterOptions, 
            sortOptions, 
            onDeletePress,
            disableDelete,
            disableActions,
            onSearchChange,
            pagination,
            onActionChange,
            onSortChange,
            onFilterChange,
            defaultSearchValue,
            onPaginationNav,
            leftActions,
            onSelectActionsTop,
            onSelectActionsBottom,
            selectedItems
        } = this.props;
        return (
            <div className={`vc-table-controls ${this.props.className} row`}>
                <div className='controls-list col-12 col-md-4'>
                    <div className='hidden md:block'>
                        { leftActions && leftActions.map((item, index) => (
                                <li className='control-item' key={index}>
                                    {item}
                                </li>
                            ))
                        }
                    </div>
                    
                </div>



                <div className='controls-list right col-12 col-md-8'>
                    { pagination && (pagination.total > pagination.perPage) &&
                        <div className='hidden md:block'>
                            <li className='control-item'>
                                <div className='pagination'>
                                    <div className='pagination-inner'>
                                        <button
                                            className='nav-button'
                                            onClick={typeof onPaginationNav == 'function'
                                                ? () => onPaginationNav('prev')
                                                : null }
                                            disabled={pagination.pageStart <= 1}
                                        >
                                            <i className='material-icons'>keyboard_arrow_left</i>
                                        </button>
                                        <span className='range'>
                                            {pagination.pageStart} -&nbsp;
                                            {pagination.pageEnd} of&nbsp;
                                            {pagination.total}
                                        </span>
                                        <button
                                            className='nav-button'
                                            onClick={typeof onPaginationNav == 'function'
                                                ? () => onPaginationNav('next')
                                                : null }
                                            disabled={pagination.pageEnd >= pagination.total}
                                        >
                                            <i className='material-icons'>keyboard_arrow_right</i>
                                        </button>
                                    </div>
                                </div>
                            </li>
                        </div>
                    }
                    
                    <div className="row right-container">
                        <div className="col-12 col-md-6">                                                
                            {typeof onSearchChange == 'function' &&
                                <li className='control-item search-container px-3 md:px-0'>
                                    <div className='search-control'>
                                        <button
                                            type='button'
                                            className='search-button'
                                            onClick={() => {
                                                if (this.searchField &&
                                                    typeof this.searchField.focus == 'function'
                                                ) {
                                                    this.searchField.focus()
                                                }
                                            }}
                                        >
                                            <i className='material-icons'>search</i>
                                        </button>
                                        <input
                                            ref={ref => this.searchField = ref}
                                            type='text'
                                            className='search-field'
                                            placeholder='Search Items'
                                            onChange={(event) => this.setState({search: event.target.value})}
                                            defaultValue={defaultSearchValue}
                                        />
                                    </div>
                                </li>
                            }
                        </div>
                        
                        <div className="col-12 col-md-6 hidden md:block">                        
                            <li className='control-item sort-filter-container'>
                                <ButtonGroup size='sm'>
                                    { sortOptions &&
                                        <Dropdown
                                            variant='link'
                                            options={sortOptions}
                                            noArrow
                                            align='right'
                                            label={`Sort `}
                                            icon={<i className="material-icons">sort</i>}
                                            onChange={typeof onSortChange == 'function'
                                                    ? (event) => onSortChange(event.target.value)
                                                    : undefined}
                                        />
                                    }
                                    {filterOptions &&
                                        <Dropdown
                                            options={filterOptions}
                                            noArrow
                                            align='right'
                                            label={`Filter `}
                                            icon={<i className="material-icons">filter_list</i>}
                                            onChange={typeof onFilterChange == 'function'
                                            ? (event) => onFilterChange(event.target.value)
                                            : undefined}
                                        />
                                    }
                                </ButtonGroup>
                            </li>
                        </div>
                        
                        {/* Action list for table top */}
                        { selectedItems && (selectedItems.length > 0) && onSelectActionsTop &&
                            <div className="w-full bg-white md:hidden py-3 px-3">
                                <div className='text-blue font-medium float-left'>{onSelectActionsTop[0]}</div>
                                <div className='text-red font-medium float-right'>{onSelectActionsTop[1]}</div>
                            </div>
                        }

                        <div className='w-full border-t-1 border-b-1 border-grey md:hidden py-2 text-brand-blue px-3'>
                            <span className='float-left'><span className='text-black'>Sorted by</span> Date Added</span>
                            { pagination && (pagination.total > pagination.perPage) &&
                                <span className='mr-6'>                                
                                    <button
                                        className='nav-button'
                                        onClick={typeof onPaginationNav == 'function'
                                            ? () => onPaginationNav('prev')
                                            : null }
                                        disabled={pagination.pageStart <= 1}
                                    >
                                        <i className='material-icons text-xs'>keyboard_arrow_left</i>
                                    </button>
                                            {pagination.pageStart} -&nbsp;
                                            {pagination.pageEnd} of&nbsp;
                                            {pagination.total}
                                    <button
                                        className='nav-button'
                                        onClick={typeof onPaginationNav == 'function'
                                            ? () => onPaginationNav('next')
                                            : null }
                                        disabled={pagination.pageEnd >= pagination.total}
                                    >
                                        <i className='material-icons text-xs'>keyboard_arrow_right</i>
                                    </button>
                                </span>
                            }
                            <span><i className="material-icons text-black text-xs">filter_list</i> Filter</span>
                        </div>

                        {/* Action list for table bottom */}
                        { selectedItems && (selectedItems.length > 0) && onSelectActionsBottom &&
                            <div className="flex fixed pin-b z-10 w-full bg-white">
                                <div className="flex w-full text-center border-t-1 border-grey-light bg-white md:hidden py-4 text-brand-blue px-3">
                                    { onSelectActionsBottom.map((item, index) => (
                                            <div className='w-1/3 text-brand-blue font-medium' key={index}>
                                                {item}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        }

                    </div>
                </div>
            </div>
        )
    }

    fileterLabel() {
    }
}