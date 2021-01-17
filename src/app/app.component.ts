import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SpaceXService } from 'src/services/space-x.service';

export enum FILTERVALUE {
  LAUNCH_TRUE = 'launchTrue',
  LAUNCH_FALSE = 'launchFalse',
  LAND_TRUE = 'landTrue',
  LAND_FALSE = 'landFalse',
  TRUE_STR = 'true',
  FALSE_STR = 'false'
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  yearsListArray = ['2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020',]
  isSelectedYear: any;
  isSelectedLanding: any;
  isSelectedLaunch: any;
  spaceXData: any = [];
  isLoading = false;
  isSelected: any;
  spaceXUrl = {
    baseUrl: `https://api.spaceXdata.com/v3/launches?limit=100`,
    launch_success: `launch_success`,
    launch_year: `launch_year`,
    land_success: `land_success`,
  };

  filterValues = {
    year: null,
    launch_success: null,
    land_success: null,
  }

  querryParamSubscription: Subscription;
  spaceXDataSubscription: Subscription;

  constructor(private spaceXService: SpaceXService, private router: Router, private activatedRouter: ActivatedRoute,) { }

  ngOnInit() {
    this.getActivatedRouterUrl();
  }

  getActivatedRouterUrl() {
    this.querryParamSubscription = this.activatedRouter.queryParams.subscribe((data) => {
      if (data) {
        this.filterValues.year = data.launch_year;
        this.filterValues.launch_success = data.launch_success;
        this.filterValues.land_success = data.land_success;
        this.setFilterValues(data);
        if (this.spaceXDataSubscription) {
          this.spaceXDataSubscription.unsubscribe();
        }
        this.isLoading = true;
        this.getFilteredData();
      }
    })
  }
  /**
   * Method to set filter selection/deselection of page refresh
   * @param data querry params from url
   */
  setFilterValues(data) {
    this.isSelectedYear = data.launch_year;
    if (data.launch_success === FILTERVALUE.TRUE_STR) {
      this.isSelectedLaunch = FILTERVALUE.LAUNCH_TRUE;
    } else if (data.launch_success === FILTERVALUE.FALSE_STR) {
      this.isSelectedLaunch = FILTERVALUE.LAUNCH_FALSE;
    }
    if (data.land_success === FILTERVALUE.TRUE_STR) {
      this.isSelectedLanding = FILTERVALUE.LAND_TRUE;
    } else if (data.land_success === FILTERVALUE.FALSE_STR) {
      this.isSelectedLanding = FILTERVALUE.LAND_FALSE;
    }
  }

  /**
   * Method to filter data on basis of user selected values
   * @param value type of filter applied
   */
  applyFilter(value) {
    this.isLoading = true;
    this.spaceXData = [];
    if (!isNaN(value)) {
      this.isSelectedYear = value;
      this.filterValues.year = value
    } else if (value === FILTERVALUE.LAUNCH_TRUE || value === FILTERVALUE.LAUNCH_FALSE) {
      this.isSelectedLaunch = value;
      if (value === FILTERVALUE.LAUNCH_TRUE) {
        this.filterValues.launch_success = FILTERVALUE.TRUE_STR;
      } else {
        this.filterValues.launch_success = FILTERVALUE.FALSE_STR;
      }
    } else if (value === FILTERVALUE.LAND_TRUE || value === FILTERVALUE.LAND_FALSE) {
      this.isSelectedLanding = value;
      if (value === FILTERVALUE.LAND_TRUE) {
        this.filterValues.land_success = FILTERVALUE.TRUE_STR;
      } else {
        this.filterValues.land_success = FILTERVALUE.FALSE_STR;
      }
    }
    this.getFilteredData();
  }

  /**
   * Method to get values form API on basis of applied filters
   */

  getFilteredData() {
    const yearFilter = this.filterValues.year ? this.filterValues.year : '';
    const launchFilter = this.filterValues.launch_success ? this.filterValues.launch_success : '';
    const landFilter = this.filterValues.land_success ? this.filterValues.land_success : '';

    const url = `${this.spaceXUrl.baseUrl}&${this.spaceXUrl.launch_year}=${yearFilter}&${this.spaceXUrl.launch_success}=${launchFilter}&${this.spaceXUrl.land_success}=${landFilter}`

    this.spaceXDataSubscription = this.spaceXService.getSpaceXData(url).subscribe((data) => {
      this.isLoading = false;
      this.spaceXData = data;
      // this.router.navigate(['.'], { relativeTo: this.activatedRouter, queryParams: { launch_year: yearFilter, launch_success: launchFilter, land_success: landFilter } });
    });
  }

  ngOnDestroy() {
    if (this.spaceXDataSubscription) {
      this.spaceXDataSubscription.unsubscribe();
    }
    if (this.querryParamSubscription) {
      this.querryParamSubscription.unsubscribe();
    }
  }
}
