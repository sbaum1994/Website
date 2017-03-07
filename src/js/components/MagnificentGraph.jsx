import React from 'react';
import * as d3 from "d3";
import * as d3Chromatic from "d3-scale-chromatic";
import * as d3Interpolate from "d3-interpolate";
import jquery from 'jquery';

class MagnificentGraph extends React.Component {
  constructor(props) {
    super(props);
  }

  draw() {
    const width = 700,
          height = 605,
          padding = { top: 0, right: 70},
          radius = 300,
          center = {
            left: (width * .484) - (padding.right/2),
            top: (height * .5) + padding.top
          },
          placeholder = 'My Experience',
          dataset = this.props.dataset,
          numberFormat = d3.format(",.2%"),
          legendPos = {
            top: (height + padding.top) * 0.38,
            left: (width + padding.right) * 0.82
          }

    let legendVals = [],
        total = 0,
        currentMessage = "Toggle top categories by clicking.";

    const mediumPurple = d3.rgb('#806080'),
          darkPurple = d3.rgb('#404060'),
          tanPurple = d3.rgb('#c0a0a0'),
          lightPurple = d3.rgb('#a080a0'),
          bluePurple = d3.rgb('#606080'),
          warmPurple = d3.rgb('#B08292'),
          aqua = d3.rgb('#00E1FB'),
          skyBlue = "rgb(0, 183, 255)",
          poolBlue = d3.rgb('#35AFFF'),
          mediumBlue = 'rgb(0, 145, 255)',
          darkBlue = 'rgb(0, 99, 214)',
          extraDarkBlue = 'rgb(0, 58, 112)',
          gold = d3.rgb('#F8A21C');


    const genScale = ((colorOne, colorTwo, depth) => { 
            let interp = d3.interpolateRgbBasis([colorOne, colorTwo]);
            return d3.scaleSequential(interp).domain([1, depth]); 
          });

            // 'Scala': genScale(extraDarkBlue, gold, colorDepth), //darkpurple
            // 'Python': genScale(skyBlue, gold, colorDepth), //blue purple
            // 'Javascript': genScale(mediumBlue, gold, colorDepth), // mediumPurple
            // 'OtherLanguages': genScale(aqua, gold, colorDepth), //tanpurple
            // 'Other': genScale(poolBlue, gold, colorDepth), //warmpurple
            // 'DevMethods': genScale(darkBlue, gold, colorDepth) //lightpurple

    // settings
    const colorDepth = 15,
          colorScale = {
            'Scala': genScale(darkPurple, poolBlue, colorDepth), //darkpurple
            'Python': genScale(bluePurple, poolBlue, colorDepth), //blue purple
            'Javascript': genScale(mediumPurple, poolBlue, colorDepth), // mediumPurple
            'OtherLanguages': genScale(tanPurple, poolBlue, colorDepth), //tanpurple
            'Other': genScale(warmPurple, poolBlue, colorDepth), //warmpurple
            'DevMethods': genScale(lightPurple, poolBlue, colorDepth) //lightpurple
          };

    const x = d3.scaleLinear().range([0, 2 * Math.PI]),
          y = d3.scalePow().exponent(0.6).range([0, radius]), //d3.scalePow().exponent(0.5) d3.scaleSqrt()
          partition = d3.partition();

    const arc = d3.arc();
    
    const outerRadius = ((d) => { return Math.max(0, y(d.y1)); }),
          innerRadius = ((d) => { return Math.max(0, y(d.y0)); }),
          startAngle = ((d) => { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); }),
          endAngle =((d) => { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); });

    const svg = d3.selectAll(".graph-container").append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 ${width + padding.right} ${height + padding.top}`);

    const g = svg.append("g")
      .attr("transform", `translate(${center.left}, ${center.top})`);

    const centerText = svg.append("text")
      .attr("class", 'center-text')
      .attr("x", center.left)
      .attr("y", center.top - 30)
      .attr("text-anchor", 'middle')
      .attr('alignment-baseline', 'central')
      .attr('dominant-baseline', 'central')
      .text(currentMessage);

    const centerMainText = svg.append("text")
      .attr("class", 'center-main-text')
      .attr("x", center.left)
      .attr("y", center.top)
      .attr("text-anchor", 'middle')
      .attr('alignment-baseline', 'central')
      .attr('dominant-baseline', 'central')
      .text(placeholder);

    const pathText = svg.append("text")
      .attr("class", 'center-text')
      .attr("x", center.left)
      .attr("y", center.top + 30)
      .attr("text-anchor", 'middle')
      .attr('alignment-baseline', 'central')
      .attr('dominant-baseline', 'central')
      .text('');

    const bottomButtonText = svg.append('text')
      .attr("class", 'bottom-button-label')
      .attr('x', legendPos.left + 15)
      .attr('y', legendPos.top + 160)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'central')
      .attr('dominant-baseline', 'central')
      .text('Reset');

    const bottomButton = svg.append('text')
      .attr("class", 'bottom-button')
      .attr('x', legendPos.left + 45)
      .attr('y', legendPos.top + 161)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'central')
      .attr('dominant-baseline', 'central')
      .text('\uf021');

    const infoButton = svg.append('text')
      .attr("class", 'info-button')
      .attr('x', legendPos.left + 65)
      .attr('y', legendPos.top + 161)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'central')
      .attr('dominant-baseline', 'central')
      .text('\uf05a');

    const infotip = d3.select("body")
      .append("div")
      .attr("class", "infotip")
      .style("opacity", 0);

    const createRoot = (dataset) => {
      return d3.hierarchy(dataset)
        .sum(function(d) { return d.count; })
        .sort(function(a,b) { return a.count - b.count });
    }

    const root = createRoot(dataset),
          node = root; // save root ref

    partition(root);

    const toggleLegend = (trait) => { 
      d3.select(`rect[ref=${trait}]`)
        .classed('active', (d) => { 
          d.active = !d.active;
          return d.active
        });

      d3.select(`text[ref=${trait}]`)
        .classed('active', (d) => { return d.active });
    }

    /*  how it works:
        the top nodes have corresponding color scales in a map see above
        then their children should all have some variation of that color
        so when we get a node we find the top parent, then find the scale that 
        corresponds to it, then run the scale on a combo of that nodes
        y and x position */
    const nodeColor = (d) => {
      /* find the second to top node in a tree */
      let find2ndFromTop = (d) => {
        if (!d.parent) return null;
        if (!(d.parent).parent) return d;
        return find2ndFromTop(d.parent);
      }

      let parentNode = find2ndFromTop(d);
      if (!parentNode) return "white";
    
      let scale = colorScale[parentNode.data.trait];
      // old by.depth * ((d.x0 + d.x1)/2 * d.y0)
      return scale(d.depth * (Math.sqrt(y(d.y0))/10 + x((d.x0+d.x1)/2)/2));
    }

    const outerRadiusTween = (d, newOuterRadius) => {
      let interpolate = d3.interpolate(d.outerRadius, newOuterRadius);
      return ((t) => {
        d.outerRadius = interpolate(t);
        return arc(d);
      });
    }

    const angleTween = (d, newStartAngle, newEndAngle) => {
      let interpolate1 = d3.interpolate(d.startAngle, newStartAngle);
      let interpolate2 = d3.interpolate(d.endAngle, newEndAngle);
      return ((t) => {
        d.startAngle = interpolate1(t);
        d.endAngle = interpolate2(t);
        return arc(d);
      })
    }

    /*  this function draws the arcs and legend the first time and stashes
        their original values, then never gets called again */
    const firstDraw = (root) => {
      const stash = function(d) {
        d.data.stash = {
          y1: d.y1,
          value: d.value,
          visible: true,
          outerRadius: d.outerRadius,
          innerRadius: d.innerRadius,
          startAngle: d.startAngle,
          endAngle: d.endAngle
        }
      }

      // draw them the first time and store vals
      const drawPaths = () => {
        const paths = g.selectAll("path").data(root.descendants(), (d) => { return d.data.trait })
        .enter().append("path")
          .attr("ref", (d) => { return d.data.trait; })
          .attr("display", (d) => { return d.depth ? null : "none"; })
          .attr("d", (d) => {
            d.data.stash = {
              y1: d.y1,
              value: d.value,
              visible: true
            }

            d.innerRadius = innerRadius(d);
            d.startAngle = startAngle(d);
            d.outerRadius = outerRadius(d);
            d.endAngle = endAngle(d);
            if (d.data.count) total += d.data.count;

            stash(d);

            if (d.depth > 1) {
              d.y1 = d.y0;
            }

            return arc(d);
          })
          .style('opacity', (d) => {
            if (d.depth > 1) {
              return 0
            } else return 1;
          })
          .style("fill", (d) => {
            const color = nodeColor(d);

            /* store color and trait names for legend */
            if (d.depth === 1) {
              const obj = {
                trait: d.data.trait,
                display: d.data.display ? d.data.display : null,
                color: color,
                active: true
              };

              legendVals.push(obj);
            }

            // store color for node if we want to change it later
            d.data.stash.color = color;

            return color;
          });
      }

      const drawLegend = () => {
        const textPadding = 10,
              verticalSpacing = 25,
              legendRect = 18;

        const legendGroup = svg.append("g")
          .attr("transform", `translate(${legendPos.left}, ${legendPos.top})`);

        let legendElement = legendGroup.selectAll('.legend')
          .data(legendVals).enter()
            .append("g")
            .attr("class", "legend")
            .attr('transform', (d, i) => {
              return `translate(0, ${i * verticalSpacing})`;
            });
        
        legendElement.append('rect')
          .attr("width", legendRect)
          .attr('height', legendRect)
          .attr('ref', (d) => { return d.trait })
          .style('fill', (d) => {
            return d.color
          })
          .classed('active', (d) => { return d.active })
          .on("click", (d) => {
            togglePath(d.trait, dataset);
            toggleLegend(d.trait);
          });

        legendElement.append('text')
          .attr('ref', (d) => { return d.trait })
          .attr('x', legendRect + textPadding)
          .attr('y', legendRect - 4)
          .classed('active', (d) => { return d.active })
          .text((d) => {
            return d.display ? d.display : d.trait;
          });
      }

      const fanOut = (i) => {
        const paths = g.selectAll("path");

        paths.each((d) => {
          if (d.depth > i) { return; }
          d.y1 = d.data.stash.y1;
        });

        paths.transition()
          .duration(750)
          .style('opacity', (d) => {
            if (d.depth > i) {
              return 0
            } else return 1;
          })
          .attrTween("d", (d) => {
            let newOuterRadius = outerRadius(d);
            d.data.stash.outerRadius = newOuterRadius;
            return outerRadiusTween(d, newOuterRadius);
          })
      };

      const timer = ((i) => {
        if (i === root.height + 1) return;
        setTimeout(() => {
            fanOut(i);
            timer(i + 1);
        }, 700);
      });

      drawPaths();
      drawLegend();
      timer(1);
    }

    const getAncestorsByTrait = (node) => {
      let path = [],
          current = node;
      while (current.parent) {
        path.unshift(current.data.trait);
        current = current.parent;
      }
      return path;
    }

    const clearCount = (node) => {
      if (!node.children) {
        node.count = 0;
        return node;
      }

      node.children.forEach((child) => {
        return clearCount(child);
      });
    }

    const restoreCount = (node) => {
      if (!node.children) {
        node.count = node.stash.value;
        return node;
      }

      node.children.forEach((child) => {
        return restoreCount(child);
      })
    }

    const addNode = (trait, nroot) => {
      if (trait === nroot.trait) {
        nroot = restoreCount(nroot);
        return;
      }

      if (!nroot.children) return;

      nroot.children.forEach((child) => {
        return addNode(trait, child);
      });
    }

    /*  iterates through legend traits, restoring all legend rects to active
      and toggleing any path that isn't visible back to visible */
    const restoreAll = () => {
      legendVals.forEach((obj) => {
        let trait = obj.trait;

        d3.selectAll(`rect[ref=${trait}]`)
        .classed('active', (d) => {
          d.active = true;
          return d.active;
        });

        d3.select(`text[ref=${trait}]`)
          .classed('active', (d) => { return d.active });

        let path = g.selectAll("path[ref=" + trait + "]");

        path.each((d) => {
          if (!d.data.stash.visible) {
            togglePath(trait, dataset);
          }
        });
      });
    }

    const removeNode = (trait, nroot) => {
      if (trait === nroot.trait) {
        nroot = clearCount(nroot);
        return;
      }

      if (!nroot.children) return;

      nroot.children.forEach((child) => {
        return removeNode(trait, child);
      });
    }

    const togglePath = (trait, dataset) => {
      let path = g.selectAll("path[ref=" + trait + "]");

      path.each((d) => {
        if (d.data.stash.visible) {
          removeNode(trait, dataset);
          d.data.stash.visible = false;
        } else {
          addNode(trait, dataset);
          d.data.stash.visible = true;
        }
      });

      let nroot = createRoot(dataset);
      partition(nroot);

      var gp = g.selectAll("path").data(nroot.descendants(), (d) => {
        return d.data.trait;
      });

      /*  we're only ever updating the data, never entering or removing, but
          for the sake of keeping the pattern ... I merge to update 

          I don't know how to update the original root data, I would if I knew
          instead I have to recreate the entire partition again with the counts
          set to 0 for the deleted elements (or set back to original count if added back) 

          even when merging it appears I lose all the paths old angle values so I can
          only do a transition with attr, not with attrTween (which is what I want) */

      gp.enter()
        .append("path")
        .merge(gp)
        .attr("d", (d) => {
          d.innerRadius = d.data.stash.innerRadius;
          d.startAngle = d.data.stash.startAngle;
          d.outerRadius = d.data.stash.outerRadius;
          d.endAngle = d.data.stash.endAngle;
          return arc(d);
        })
        .transition().duration(750)
        .attrTween("d", (d) => { 
          let newStartAngle = startAngle(d);
          let newEndAngle = endAngle(d);
          d.data.stash.startAngle = newStartAngle;
          d.data.stash.endAngle = newEndAngle;
          return angleTween(d, newStartAngle, newEndAngle);
        });
    }

    const fadeAllExcept = (d, ancestors) => {
      let paths = g.selectAll("path");
      paths.style("opacity", 0.6);

      g.selectAll("path[ref=" + d.data.trait + "]").style("opacity", 1);
      ancestors.forEach(function(trait) {
        g.selectAll("path[ref=" + trait + "]").style("opacity", 1);
      });
    }

    const bindClick = (root) => {
      let paths = g.selectAll("path");
      paths.on("click", (d) => {
        if(d.depth === 1) {
          toggleLegend(d.data.trait);
          togglePath(d.data.trait, dataset);
        }
      });

      paths.on("mouseover", (d) => {
        let ancestors = getAncestorsByTrait(d),
            cats = ancestors.join(' : ');

        fadeAllExcept(d, ancestors);

        if (d.depth <= 1) cats = '';

        let text = `${numberFormat(d.value/total)} of my experience has been in`;
        let mainText = d.data.display ? d.data.display : d.data.trait;

        pathText.transition().duration(100).text(cats);
        centerText.transition().duration(100).text(text);
        centerMainText.transition().duration(100).text(mainText);
      });

      paths.on("mouseout", () => {
        pathText.transition().duration(100).text('');
        centerText.transition().duration(100).text(currentMessage);
        centerMainText.transition().duration(100).text(placeholder);
        paths.style("opacity", 1);
      });

      bottomButton.on('click', () => {
        restoreAll();
      });

      bottomButtonText.on('click', () => {
        restoreAll();
      });

      infoButton.on('mouseover', (d) => {
        infotip.transition().duration(200)
          .style("opacity", .9);
        infotip.html("This graph shows a rating of my experience based on how long I've been working with the given technologies. It's a hierarchial sunburst with custom interactions I've created myself using d3 and arc tween transitions.")
          .style("left", (d3.event.pageX - 40) + "px")
          .style("top", (d3.event.pageY + 15) + "px");
      });

      infoButton.on('mouseout', (d) => {
        infotip.transition().duration(200)
          .style('opacity', 0);
      })
    }

    firstDraw(root);
    bindClick(root);


  }

  componentDidMount() {
    this.draw()
  }

  render() {
    return null;
  }
}

MagnificentGraph.propTypes = {
  dataset: React.PropTypes.object.isRequired
};

export default MagnificentGraph;
