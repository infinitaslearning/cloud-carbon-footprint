/*
 * © 2021 Thoughtworks, Inc.
 */

import React from 'react'
import moment from 'moment'
import { MemoryRouter, Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { fireEvent, render } from '@testing-library/react'
import { generateEstimations, fakeEmissionFactors } from './utils/data'
import {
  useRemoteService,
  useRemoteEmissionService,
  useRemoteRecommendationsService,
} from './utils/hooks'
import {
  EstimationResult,
  EmissionRatioResult,
  RecommendationResult,
} from '@cloud-carbon-footprint/common'
import { ServiceResult } from './Types'
import App from './App'

jest.mock('apexcharts')
jest.mock('./utils/hooks/RemoteServiceHook')
jest.mock('./utils/hooks/EmissionFactorServiceHook')
jest.mock('./utils/hooks/RecommendationsServiceHook')
jest.mock('./utils/themes')

const mockedUseRemoteService = useRemoteService as jest.MockedFunction<
  typeof useRemoteService
>
const mockedUseEmissionFactorService =
  useRemoteEmissionService as jest.MockedFunction<
    typeof useRemoteEmissionService
  >
const mockedUseRecommendationsService =
  useRemoteRecommendationsService as jest.MockedFunction<
    typeof useRemoteRecommendationsService
  >

describe('App', () => {
  beforeEach(() => {
    const mockReturnValue: ServiceResult<EstimationResult> = {
      loading: false,
      data: generateEstimations(moment.utc(), 14),
    }
    const mockEmissionsReturnValue: ServiceResult<EmissionRatioResult> = {
      loading: false,
      data: fakeEmissionFactors,
    }
    const mockRecommendationsReturnValue: ServiceResult<RecommendationResult> =
      {
        loading: false,
        data: [],
      }
    mockedUseEmissionFactorService.mockReturnValue(mockEmissionsReturnValue)
    mockedUseRemoteService.mockReturnValue(mockReturnValue)
    mockedUseRecommendationsService.mockReturnValue(
      mockRecommendationsReturnValue,
    )
  })

  afterEach(() => {
    mockedUseEmissionFactorService.mockClear()
    mockedUseRemoteService.mockClear()
    mockedUseRecommendationsService.mockClear()
  })

  it('renders the page title', () => {
    const { getAllByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )
    const linkElement = getAllByText(/Cloud Carbon Footprint/i)[0]
    expect(linkElement).toBeInTheDocument()
  })

  it('renders the mobile compatability warning if the window is too small and loads the page when closed', () => {
    global.innerWidth = 700 // Set page width below threshold
    const { getByTestId, queryByTestId, getByRole } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )

    expect(getByTestId('warning-modal')).toBeInTheDocument()

    const closeButton = getByRole('button')
    fireEvent.click(closeButton)

    expect(getByTestId('infoIcon')).toBeInTheDocument()
    expect(queryByTestId('warning-modal')).toBeFalsy()

    global.innerWidth = 1024 // Reset page width back to default size
  })

  describe('page routing', () => {
    it('navigates to the home page', () => {
      const history = createMemoryHistory()
      history.push('/')

      const { getByTestId } = render(
        <Router history={history}>
          <App />
        </Router>,
      )

      expect(getByTestId('infoIcon')).toBeInTheDocument()
    })

    it('navigates to the Recommendations Page', () => {
      const history = createMemoryHistory()
      history.push('/recommendations')

      const { getByText } = render(
        <Router history={history}>
          <App />
        </Router>,
      )

      expect(getByText('Recommendations')).toBeInTheDocument()
    })
  })
})
