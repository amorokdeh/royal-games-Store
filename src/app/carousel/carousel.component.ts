import { Component, Input, OnInit } from '@angular/core';

interface carouselImages {
  imageSrc: string;
  imageAlt: string;
}

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  constructor() { }

  @Input() images: carouselImages[] = []
  @Input() indicators = true;
  @Input() controls = true;
  @Input() autoSlide = false;
  @Input() slideInterval = 2500;

  selectedIndex = 0;

  ngOnInit(): void {
    if(this.autoSlide) {
      this.autoSlideImages();
    }
  }

  autoSlideImages(): void {
    setInterval(() => {
      this.onNextClick();
    }, this.slideInterval);
  }

  //sets index of image on dot/indicator click
  selectedImage(index: number): void {
  this.selectedIndex = index;
  }

  onPrevClick(): void{
      if(this.selectedIndex === 0){
        this.selectedIndex =this.images.length -1;
      } else {
        this.selectedIndex--;
      }
  }

  onNextClick(): void {
    if(this.selectedIndex === this.images.length - 1) {
      this.selectedIndex = 0;
    } else {
      this.selectedIndex++;
    }
  }
}
