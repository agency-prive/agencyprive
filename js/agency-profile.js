/* Agency Privé: replace the empty array with reviewed, published backend records. */
let approvedAgencyProfiles = [];
document.addEventListener('DOMContentLoaded', async () => {
 const byId = id => document.getElementById(id);
 const str = x => String(x ?? '').trim();
 const set = (id,x) => { if(byId(id)) byId(id).textContent = str(x); };
 const array = x => Array.isArray(x) ? x : [];
 const url = x => { try { const parsed = new URL(x); return ['https:','http:'].includes(parsed.protocol) ? parsed.href : ''; } catch { return ''; } };
 const add = (parent, tag, cls, text) => { const el=document.createElement(tag);el.className=cls;el.textContent=str(text);parent.append(el);return el; };
 const notice = (id,msg) => add(byId(id),'p','profile-no-data',msg);
 try {
  const response = await fetch('data/approved-agencies.json', {cache:'no-store'});
  if (!response.ok) throw new Error('Agency data unavailable');
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error('Invalid agency data');
  approvedAgencyProfiles = data.filter(x => x && x.status === 'approved' && x.published === true && /^[a-z0-9_-]{1,80}$/i.test(String(x.slug || '')))
   .map(x => ({...x,id:x.slug,verificationStatus:x.verified === true ? 'verified' : 'unverified',
    positioningStatement:x.positioning || x.positioningStatement, reviews:Array.isArray(x.reviews) ? x.reviews : [],
    countries:Array.isArray(x.countriesServed) ? x.countriesServed : [], socialLinks:x.socials || {}}));
 } catch (error) {
  console.error('Could not load public agency profile:', error);
  return;
 }
 const key=new URLSearchParams(location.search).get('id');
 const agency=approvedAgencyProfiles.find(x => (str(x.id)===key || str(x.slug)===key) && x.status==='approved' && x.published===true);
 if(!agency)return;
 byId('profileUnavailable').hidden=true;byId('profilePublished').hidden=false;
 document.title=str(agency.name)+' | Agency Privé';
 set('agencyName',agency.name);set('breadcrumbAgencyName',agency.name);
 set('agencyTagline',agency.positioningStatement || agency.tagline || 'Positioning statement not provided.');
 set('agencyLocation',agency.location || agency.country || 'Location not provided');
 set('agencyExperience',agency.yearsInBusiness ? agency.yearsInBusiness+' years in business' : 'Experience not provided');
 set('agencySize',agency.size || 'Size not provided');
 set('agencyDescription',agency.about || agency.description || 'About information has not been published.');
 set('sidebarHeadquarters',agency.location || agency.country || 'Not provided');set('sidebarSize',agency.size || 'Not provided');set('sidebarYears',agency.yearsInBusiness ?? 'Not provided');
 const cover=url(agency.coverImageUrl);if(cover){byId('profileCover').style.backgroundImage='url("'+cover.replace(/"/g,'%22')+'")';byId('profileCover').setAttribute('aria-label','Cover image for '+str(agency.name));}
 const logo=byId('agencyLogo');const image=url(agency.logoUrl);if(image){const img=document.createElement('img');img.src=image;img.alt=str(agency.name)+' logo';img.loading='lazy';logo.replaceChildren(img);}else set('agencyLogo',agency.initials || str(agency.name).slice(0,2).toUpperCase());
 const verified=agency.verificationStatus==='verified';byId('verificationBadge').hidden=!verified;
 set('verificationDescription',verified?'Business identity and authorized representative reviewed.':'This agency is not currently verified.');
 byId('topRatedBadge').hidden=agency.topRated!==true;
 const sponsored=agency.sponsored===true;byId('sponsoredBadge').hidden=!sponsored;byId('placementDisclosure').hidden=!sponsored;
 const website=url(agency.website);if(website){byId('agencyWebsite').href=website;byId('agencyWebsite').hidden=false;}
 const contact=agency.acceptingInquiries===true;byId('contactAgencyButton').hidden=!contact;
 set('contactAvailability',contact?'Accepting inquiries':'Inquiry availability not confirmed');
 const services=byId('servicesGrid');if(!array(agency.services).length)notice('servicesGrid','No services published.');
 array(agency.services).forEach(service=>{const card=add(services,'article','service-card','');add(card,'h3','',typeof service==='string'?service:service.name);if(service?.description)add(card,'p','',service.description);});
 function tags(id,items,empty){if(!array(items).length)notice(id,empty);else array(items).forEach(item=>add(byId(id),'span','',item));}
 tags('expertiseTags',agency.niches || agency.expertise,'No creator niches published.');
 const regions=agency.countriesServed || agency.countries;if(!array(regions).length)notice('locationList','No additional regions published.');else array(regions).forEach(item=>add(byId('locationList'),'div','',item));
 function entries(id,items,empty,kind){const published=array(items).filter(x=>x?.status==='published' && (kind!=='result' || (x.metric && x.timeframe && x.evidenceStatus==='reviewed')));if(!published.length)return notice(id,empty);
 published.forEach(item=>{const card=add(byId(id),'article','profile-entry-card','');if(kind==='portfolio' && url(item.imageUrl)){const img=document.createElement('img');img.src=url(item.imageUrl);img.alt=str(item.imageAlt || item.title);img.loading='lazy';card.append(img);}add(card,'h3','',item.title);add(card,'p','',item.summary || item.description);if(kind==='result'){add(card,'strong','',item.metric);add(card,'small','', 'Timeframe: '+item.timeframe+' · Evidence reviewed');}});}
 entries('portfolioGrid',agency.portfolio,'No portfolio work published.','portfolio');entries('caseStudyGrid',agency.caseStudies,'No case studies published.','case');entries('resultsGrid',agency.results,'No substantiated results published.','result');
 const reviews=array(agency.reviews).filter(x=>x?.status==='published' && Number(x.rating)>=1 && Number(x.rating)<=5);
 set('reviewSummary',reviews.length?reviews.length+' published review'+(reviews.length===1?'':'s'):'No published reviews yet.');
 reviews.forEach(review=>{const card=add(byId('reviewsGrid'),'article','profile-entry-card','');add(card,'strong','',Number(review.rating).toFixed(1)+' / 5');add(card,'p','',review.text);if(review.responseStatus==='published' && review.agencyResponse)add(card,'p','','Agency response: '+review.agencyResponse);});
 const socials=byId('profileSocials');for(const [label,target] of Object.entries(agency.socials || {})){const safe=url(target);if(!safe)continue;const link=add(socials,'a','',label);link.href=safe;link.target='_blank';link.rel='noopener noreferrer';}if(!socials.children.length)notice('profileSocials','No social links published.');
 const related=approvedAgencyProfiles.filter(x=>x!==agency && x.status==='approved' && x.published===true && x.category===agency.category).slice(0,3);if(!related.length)notice('relatedAgencyGrid','No related agencies published yet.');
 related.forEach(item=>{const card=add(byId('relatedAgencyGrid'),'article','related-agency-card','');add(card,'h3','',item.name);add(card,'p','',item.positioningStatement || item.location || '');const link=add(card,'a','','View profile →');link.href='agency-profile.html?id='+encodeURIComponent(item.id);});
 byId('reportProfileButton').addEventListener('click',event=>{event.currentTarget.textContent='Reporting will be available when support is connected.';event.currentTarget.disabled=true;});
 const modal=byId('contactModal'),opener=byId('contactAgencyButton');function close(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('profile-modal-open');opener.focus();}
 opener.addEventListener('click',()=>{modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('profile-modal-open');byId('contactName').focus();});
 byId('closeContactModal').addEventListener('click',close);modal.addEventListener('click',event=>{if(event.target===modal)close();});document.addEventListener('keydown',event=>{if(event.key==='Escape' && modal.classList.contains('open'))close();});
 byId('agencyContactForm').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(!form.checkValidity() || !byId('contactMessage').value.trim()){set('contactFormMessage','Complete all fields and enter a valid email address.');form.reportValidity();return;}set('contactFormMessage','Inquiry delivery is not connected yet. Your message has not been sent.');});
});
