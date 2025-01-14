/*
 * © 2021 Thoughtworks, Inc.
 */

import { Grid } from '@material-ui/core'
import React, {
  Dispatch,
  FunctionComponent,
  ReactElement,
  SetStateAction,
} from 'react'
import useStyles from './filterBarStyles'
import { FilterOptions, FilterProps } from 'Types'
import { Filters } from './utils/Filters'

type FilterBarProps = {
  config: {
    filters: Filters
    setFilters: Dispatch<SetStateAction<Filters>>
    filterOptions: FilterOptions
  }
  components: FunctionComponent<FilterProps>[]
  suffixComponent?: ReactElement
}

const FilterBar: FunctionComponent<FilterBarProps> = ({
  config,
  components,
  suffixComponent,
}) => {
  const classes = useStyles()
  return (
    <div data-testid="filterBar" className={classes.filterHeader}>
      <Grid
        container
        spacing={3}
        direction={'row'}
        justify={'center'}
        alignItems={'center'}
      >
        <Grid item xs={12} sm={'auto'}>
          <div className={classes.filterContainer}>
            <div className={classes.filterContainerSection}>
              {components.map((FilterComponent, i) => (
                <div key={i} className={classes.filter}>
                  <FilterComponent
                    filters={config.filters}
                    setFilters={config.setFilters}
                    options={config.filterOptions}
                  />
                </div>
              ))}
            </div>
          </div>
        </Grid>
        {suffixComponent && (
          <Grid item xs={12} sm={'auto'}>
            <div className={classes.filterContainer}>
              <div className={classes.filterContainerSection}>
                {suffixComponent}
              </div>
            </div>
          </Grid>
        )}
      </Grid>
    </div>
  )
}

export default FilterBar
