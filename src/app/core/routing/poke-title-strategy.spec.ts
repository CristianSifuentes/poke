import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router, TitleStrategy, provideRouter } from '@angular/router';

import { PokeTitleStrategy, formatPageTitle } from './poke-title-strategy';

@Component({ template: '' })
class Blank {}

describe('PokeTitleStrategy', () => {
  it('formats page titles with the app name', () => {
    expect(formatPageTitle('Search')).toBe('Search · Poké');
    expect(formatPageTitle(undefined)).toBe('Poké');
  });

  it('sets the document title from the active route', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'search', title: 'Search', component: Blank },
          { path: 'untitled', component: Blank },
        ]),
        { provide: TitleStrategy, useClass: PokeTitleStrategy },
      ],
    });
    const router = TestBed.inject(Router);
    const title = TestBed.inject(Title);

    await router.navigateByUrl('/search');
    expect(title.getTitle()).toBe('Search · Poké');

    await router.navigateByUrl('/untitled');
    expect(title.getTitle()).toBe('Poké');
  });
});
