import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { SideNavDetails } from '../../constands/project.constant';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MatSidenavModule, MatIconModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  navItems = SideNavDetails;
  activeIndex : number = 0;
  heading : string = '';
  subHeading : string | null = null;
  isSmallScreen : boolean = false;
  sidebarOpen : boolean = true;

  constructor(private router: Router, private eRef: ElementRef) { }

  ngOnInit(): void {
    this.onResize();
    const currentUrl = this.router.url;
    const index = this.navItems.findIndex(item => currentUrl.startsWith(item.route));
    this.activeIndex = index !== -1 ? index : 0;

    const activeItem = this.navItems[this.activeIndex];
    this.heading = activeItem.heading;
    this.subHeading = activeItem.subHeading;

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.urlAfterRedirects;
        const index = this.navItems.findIndex(item => currentUrl.startsWith(item.route));
        this.activeIndex = index !== -1 ? index : 0;
        const activeItem = this.navItems[this.activeIndex];
        this.heading = activeItem.heading;
        this.subHeading = activeItem.subHeading;
      }
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.isSmallScreen = window.innerWidth < 800;
    if (this.isSmallScreen) this.sidebarOpen = false;
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event) {
    if (
      this.isSmallScreen &&
      this.sidebarOpen &&
      !this.eRef.nativeElement.querySelector('.main-side-nav')?.contains(event.target) &&
      !this.eRef.nativeElement.querySelector('.menu-icon')?.contains(event.target)
    ) {
      this.sidebarOpen = false;
    }
  }

  setActive(index: number) {
    this.activeIndex = index;
    const selectedItem = this.navItems[index];
    this.heading = selectedItem.heading;
    this.subHeading = selectedItem.subHeading;
    this.router.navigate([selectedItem.route]);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebarOnSelection() {
    if (this.isSmallScreen) {
      this.sidebarOpen = false;
    }
  }
}
