import * as Types from '../../constants/ActionType';
let initialState = [];

const filterData = (state = initialState, action) => {
    switch (action.type) {
        case Types.FETCH_FILTER_DATA:
            state = action.filterData;
            return [...state];
        default: return [...state];
    }
};

export const actFetchFilterData = (filterData) => {
    return {
        type: Types.FETCH_FILTER_DATA,
        filterData
    }
}

export default filterData;